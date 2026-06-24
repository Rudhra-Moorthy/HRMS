const pool = require('../../../config/db');
const { hashPassword } = require('../../../utils/hash');
const employeeRepo = require('../repository/employeeRepo');

//  Global cache variable
let CACHED_EMPLOYEE_ROLE_ID = null;

async function initializeCache() {

    try {
        const query = `
            SELECT id FROM roles WHERE name = 'Employee' LIMIT 1
        `;

        const result = await pool.query(query);

        if(result.rows.length > 0) {
            CACHED_EMPLOYEE_ROLE_ID = result.rows[0].id;
            console.log(`Role id is successfully cached.`);
        }
    } catch (err) {
        console.log(`Error: Employee role cache:`, err);
    }
}

// Create Employee
const createEmployee = async (dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        if(!CACHED_EMPLOYEE_ROLE_ID) {
            await initializeCache();
        }

        const tempPassword = `FedHub@${dto.email}`;
        
        // Create a user credentails for the employee
        const password = await hashPassword(tempPassword);
        const newUser = await employeeRepo.createUser(client, {email: dto.email, password }, CACHED_EMPLOYEE_ROLE_ID);
        
        // Link user ID to employee data and create new employee record
        dto.userId = newUser.id;
        const employee = await employeeRepo.createEmployee(client, dto);

        // Create address
        await employeeRepo.createAddress(client, employee.id, dto.address);
        
        // map the employee salary structure
        await employeeRepo.createSalary(client, employee.id, dto.salaryStructure);

        // Map Leave Policy
        await employeeRepo.assignLeavePolicy(client, employee.id, dto.leavePolicyId);

        // Initialize the attendance
        await employeeRepo.initializeAttendanceSummary(client, employee.id);



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

const updateEmployee = async (employeeId, dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Update Employee */
        const employee = await employeeRepo.updateEmployee(client, employeeId, dto);

        /* Update user if email changes */
        if(dto.email) {
            await employeeRepo.updateUserEmail(client, employee.user_id, dto.email);
        }

        /* Update Address */
        if(dto.address) {
            await employeeRepo.updateAddress(client, employeeId, dto.address);
        }

        /* Update Salary */
        if(dto.salaryStructure) {
            const calculatedSalary = calculateSalary(dto.salaryStructure);
            await employeeRepo.updateSalary(client, employeeId, calculatedSalary);
        }

        await client.query('COMMIT');

        return await employeeRepo.getEmployee(employeeId);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {
        client.release();
    }

}

function calculateSalary (salary) {

    const fixedCtc = salary.basicPay + salary.hra + salary + salary.medical + salary.conveyance + salary.speacialAllowance + salary.advanceBonus + salary.companyPf;
    
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
};