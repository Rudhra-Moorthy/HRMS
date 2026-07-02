const pool = require('../../../config/db');
const { hashPassword } = require('../../utils/hash');
const employeeRepo = require('../repository/employeeRepo');
const crypto = require('crypto');

//  Cache role ID after first successful lookup
let CACHED_EMPLOYEE_ROLE_ID = null;

async function getEmployeeRoleId(client) {

    if(CACHED_EMPLOYEE_ROLE_ID) {
        return CACHED_EMPLOYEE_ROLE_ID;
    }

    const query = `
        SELECT id FROM roles WHERE name = $1 LIMIT 1
    `;

    const result = await client.query(query, ['Employee']);

    if(result.rows.length === 0) {
        const err = new Error('Employee role is not configured in roles table');
        err.statusCode = 400;
        throw err;
    }

    CACHED_EMPLOYEE_ROLE_ID = result.rows[0].id;
    return CACHED_EMPLOYEE_ROLE_ID;
}


// Create Employee
const createEmployee = async (dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* 
            1. Check for existing user 
        */
        const existingUser = await employeeRepo.findUserByEmail(client, dto.email);
        if(existingUser) {
            const err = new Error('Email is already registered');
            err.statusCode = 409;
            throw err;
        }

        /* 
            2. Get Employee Role Id 
        */
        const employeeRoleId = await getEmployeeRoleId(client);

        /* 
            3. Create User with temporary password 
        */
        const tempPassword = `FedHub@${dto.email}`;
        const password = await hashPassword(tempPassword);
        const newUser = await employeeRepo.createUser(client, {email: dto.email, password, roleId: employeeRoleId });
        
        /*  
            4. Create Employee
            Link user ID to employee data and create new employee record 
        */
        dto.userId = newUser.id;
        const employee = await employeeRepo.createEmployee(client, dto);

        /* 
            5. Create address 
        */
        await employeeRepo.createAddress(client, employee.id, dto.address);
        
        /* 
            6. Create salary structure 
        */
        await employeeRepo.createSalary(client, employee.id, dto.salaryStructure);

        /*
            7. Read leave policies using employee employment category.   
        */
        const policies = await employeeRepo.getActiveLeavePoliciesByCategory(client, dto.employmentCategoryId);
        if(policies.length === 0) {
            const err = new Error('No active leave policies found for seleted employment category');
            err.statusCode = 400;
            throw err;
        }

        /* 
            8. Create Employee leave balance 
        */
        await employeeRepo.createEmployeeLeaveBalances(client, employee.id, policies);

        /*
            9. Initialize leave accrual records 
        */
        await employeeRepo.initializeLeaveAccrual(client, employee.id, policies);

        /*
            10. Initialize Attendance Policy
        */
        const attendancePolicy = await employeeRepo.getDefaultAttendancePolicy(client);
        if(!attendancePolicy) {
            const err = new Error('No activ attendance policy found');
            err.statusCode = 400;
            throw err;
        }
        await employeeRepo.assignAttendancePolicy(client, employee.id, attendancePolicy.policy_id);

        /* 11. Initialize Shift */
        const shift = await employeeRepo.getDepartmentDefaultShift(client, dto.departmentId);
        if(!shift) {
            const err = new Error('No default shift configured for department');
            err.statusCode = 400;
            throw err;
        }
        await employeeRepo.assignEmployeeShift(client, employee.id, shift.shift_id);

        /* 12. Get Department Reporting Manager */
        const reportingManager = await employeeRepo.getDepartmentReportingManager(client, dto.departmentId);
        if(reportingManager) {
            await employeeRepo.assignReportingManager(client, employee.id, reportingManager.manager_id);
        }

        await client.query('COMMIT');

        return {
            employee,
            temporaryPassword: tempPassword
        };

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {
        client.release();
    }
}

/*
    Update Employee:
        - employees table
        - users (email)
        - address
        - salary structure
        - leave policy/ balance reset when employment category changes
*/
const updateEmployee = async (employeeId, dto) => {

    const client = await pool.connect(); 

    try {

        await client.query('BEGIN');

        const existingEmployee = await employeeRepo.getEmployee(client, employeeId);
        if(!existingEmployee) {
            const err = new Error('Employee not found');
            err.statusCode = 404;
            throw err;
        }

        // Prevent duplicate email before updating users table.
        if(dto.email && dto.email.toLowerCase() !== existingEmployee.email.toLowerCase()) {
            const existingUser = await employeeRepo.findUserByEmail(client, dto.email);
            if(existingUser) {
                const err = new Error('Email is already registered');
                err.statusCode = 409;
                throw err;
            }

            await employeeRepo.updateUserEmail(client, existingEmployee.user_id, dto.email);
        }

        /* Update Employee main table fields */
        await employeeRepo.updateEmployee(client, employeeId, dto);

        /* Update Address if address object is sent */
        if(dto.address) {
            await employeeRepo.updateAddress(client, employeeId, dto.address);
        }

        /* Update Salary if salary structure is sent */
        if(dto.salaryStructure) {
            const calculatedSalary = calculateSalary(dto.salaryStructure);
            await employeeRepo.updateSalary(client, employeeId, calculatedSalary);
        }

        /*
            Employment Category changed: Ex:- PROBATION -> PERMANENT 
            This hets the new category policies and updates current-year balances.
            Keep leave history intact, only current available balance is recalculated
        */
        if(dto.employmentCategoryId !== undefined && Number(dto.employmentCategoryId) !== Number(existingEmployee.employment_category_id)) {
            
            const policies = await employeeRepo.getActiveLeavePoliciesByCategory(client, dto.employmentCategoryId);

            if(!policies.length) {
                const err = new Error('No active leave policies found for selected employment category');
                err.statusCode = 400;
                throw err;
            }

            /*
                Leave Balance History 
            */
            await employeeRepo.closeCurrentLeaveBalances(client, employeeId);
            await employeeRepo.createEmployeeLeaveBalances(client, employeeId, policies);

           /* 
                Leave Accrual History
           */
            await employeeRepo.closeCurrentLeaveAccruals(client, employeeId);
            await employeeRepo.initializeLeaveAccruals(client, employeeId, policies);

        }

        await client.query('COMMIT');

        return await employeeRepo.getEmployee(pool, employeeId);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {
        client.release();
    }

}

/*
    Get All Employees
*/
const getEmployees = async(filters) => {
    return employeeRepo.getEmployees(pool, filters);
}

/*
    Get One Employee
*/
const getEmployee = async (employeeId) => {


    const employee = await employeeRepo.getEmployee(pool, employeeId);

    if(!employee) {
        const err = new Error('Employee not found');
        err.statusCode = 404;
        throw err;
    }

    return employee;

}

/* 
    Soft Delete Employee
        - employee status becomes INACTVE
        - employee delete_at is set
        - user login is disabled
*/
const deleteEmployee = async(employeeId) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const employee = await employeeRepo.getEmployee(client, employeeId);

        if(!employee) {
            const err = new Error('Employee not found');
            err.statusCode = 404;
            throw err;
        }

        await employeeRepo.deleteEmployee(client, employeeId);
        await employeeRepo.deleteUser(client, employee.user_id);

        await client.query('COMMIT');

        return {
            employeeId: Number(employeeId),
            message: 'Employee deactivated successfully'
        };

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {
        client.release();
    }

}

function calculateSalary (salary) {

    const fixedCtc = salary.basicPay + salary.hra + salary.medical + salary.conveyance + salary.specialAllowance + salary.advanceBonus + salary.companyPf;
    
    const totalCtc = fixedCtc + salary.aplc;

    const grossSalary = fixedCtc - salary.companyPf;

    const totalDeductions = salary.employeePf + salary.professionalTax + salary.esi;

    const netTakeHome = grossSalary - totalDeductions;

    return {
        ...salary,
        fixedCtc,
        totalCtc,
        grossSalary,
        totalDeductions,
        netTakeHome
    };
}

module.exports = {
    createEmployee,
    updateEmployee,
    getEmployee,
    getEmployees,
    deleteEmployee
};