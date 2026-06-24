const pool = require('../../../config/db');

// Employee Table
const createEmployee = async(client, employee) => {

    const query = `
        INSERT INTO employees(
            employee_code, 
            user_id,
            full_name, 
            email,
            phone,
            dept_id, 
            desg_id,
            date_of_joining,
            salary,
            status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')
        RETURNING *
    `;
    const values = [
        employee.employeeCode,
        employee.userId,
        employee.fullName,
        employee.email,
        employee.phone,
        employee.departmentId,
        employee.designationId,
        employee.joinDate,
        employee.salary
    ];

    const result = await client.query(query, values);
    return result.rows[0];

}

// User Table
const createUser = async (client, user, roleId) => {

    const query = `
        INSERT INTO users (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [user.email, user.password, roleId];

    const result = await client.query(query, values);
    return result.rows[0];

}

// Address Table
const createAddress = async (client, employeeId, address) => {

    const query = `
        INSERT INTO employee_addresses(
            employee_id,
            address_line_1, 
            address_line_2,
            city,
            state,
            country,
            postal_code
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

    const values = [
        employeeId, 
        address.address_line_1, 
        address.address_line_2, 
        address.city, 
        address.state, 
        address.country, 
        address.postal_code
    ];

    await client.query(query, values);

}

// Salary Structure
const createSalary = async (client, employeeId, salary) => {

    const query = `
        INSERT INTO salary_structure (
            emp_id,
            basic_pay,
            hra,
            medical,
            conveyance,
            special_allowances,
            advance_bonus,
            company_pf
            aplc,
            provident_fund_employee,
            esi,
            professional_tax,
            total_ctc,
            gross_salary,
            total_deductions,
            net_take_home
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
    `;
    const values = [
        employeeId,
        salary.basicPay,
        salary.hra,
        salary.medical,
        salary.conveyance,
        salary.specialAllowance,
        salary.advanceBonus,
        salary.companyPf,
        salary.aplc,
        salary.employeePf,
        salary.esi,
        salary.professionalTax,
        salary.totalCtc,
        salary.grossSalary,
        salary.totalDeductions,
        salary.netTakeHome
    ];

    await client.query(query, values);
}

// Map the leave Policy
const assignLeavePolicy = async (client, employeeId, policyId) => {

    const query = `
        SELECT * 
        FROM leave_policy
        WHERE policy_id = $1
    `;

    const policy = await client.query(query, [policyId]);

    const policies = policy.rows;

    for(const leave of policies) {

        const q = `
            INSERT INTO employee_leave_balance (
                employee_id,
                leave_id, 
                opening_balance,
                earned_leave,
                used_leave,
                available_leave,
                year
            )
            VALUES ($1, $2, $3, 0, 0, $3, EXTRACT(YEAR FROM CURRENT_DATE));
        `;

        await client.query(q, [employeeId, leave.leave_id, leave.annual_quota]);
    }

}

// Attendance summary
const initializeAttendanceSummary = async (client, employeeId) => {

    const query = `
        INSERT INTO attendance_summary (
            employee_id,
            present_days, 
            absent_days,
            leave_days
        )
        VALUES ($1, 0, 0, 0);
    `;

    await client.query(query, [employeeId]);
}

// Get All Employees
const getEmployees = async () => {

    const query = `
        SELECT 
            e.id,
            e.employee_code,
            e.full_name,
            e.email,
            e.phone,
            d.dept_name,
            ds.designation_name,
            e.date_of_joining,
            e.status,
            e.salary,
            s.basic_pay,
            s.hra,
            s.medical,
            s.conveyance,
            s.special_allowances,
            s.advance_bonus,
            s.company_pf
            s.aplc,
            s.provident_fund_employee,
            s.esi,
            s.professional_tax,
            s.total_ctc,
            s.gross_salary,
            s.total_deductions,
            s.net_take_home,
            ea.address_line_1, 
            ea.address_line_2,
            ea.city,
            ea.state,
            ea.country,
            ea.postal_code
        FROM employees e
        JOIN departments d
            ON e.dept_id = d.id;
        JOIN designations ds
            ON e.desg_id = ds.id;
        JOIN salary_structure s
            ON e.id = s.emp_id
        JOIN employee_addresses ea
            ON e.id = ea.employee_id
        WHERE e.deleted_at IS NULL;
    `;

    const result = await pool.query(query);
    
    return result.rows;
}

// Get Employee by id
const getEmployee = async (id) => {

    const query = `
        SELECT 
            e.id,
            e.employee_code,
            e.full_name,
            e.email,
            e.phone,
            d.dept_name,
            ds.designation_name,
            e.date_of_joining,
            e.status,
            e.salary,
            s.basic_pay,
            s.hra,
            s.medical,
            s.conveyance,
            s.special_allowances,
            s.advance_bonus,
            s.company_pf
            s.aplc,
            s.provident_fund_employee,
            s.esi,
            s.professional_tax,
            s.total_ctc,
            s.gross_salary,
            s.total_deductions,
            s.net_take_home,
            ea.address_line_1, 
            ea.address_line_2,
            ea.city,
            ea.state,
            ea.country,
            ea.postal_code
        FROM employees e
        JOIN departments d
            ON e.dept_id = d.id;
        JOIN designations ds
            ON e.desg_id = ds.id;
        JOIN salary_structure s
            ON e.id = s.emp_id
        JOIN employee_addresses ea
            ON e.id = ea.employee_id
        WHERE id = $1 AND e.deleted_at IS NULL;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}

// Update employee -> Patch
const updateEmployee = async (client, id, payload) => {

    const allowedFields = { 
        fullName: "full_name", 
        email: "email",
        phone: "phone", 
        departmentId: "dept_id", 
        designationId: "desg_id", 
        dateOfJoining: "date_of_joining", 
        salary: "salary" 
    }

    const fields = [], values = [];

    let idx = 1;

    for(const key in payload) {

        if(allowedFields[key]) {
            fields.push(`${allowedFields[key]} = $${idx}`);
            values.push(payload[key]);
            idx++;
        }
    }

    if(fields.length === 0) {
        return;
    }
    values.push[id];

    const query = `
        UPDATE employees 
        SET 
            ${fields.join(', ')}, 
            updated_at = NOW()
        WHERE id = $${idx};
    `;

    const result = client.query(query, values);

    return true;
}

// Update user email if changed
const updateUserEmail = async (client, userId, email) => {

    const query = `
        UPDATE users 
        SET
            email = $1
        WHERE id = $2 
    `;

    await client.query(query, [email, userId]);
}

// Update address
const updateAddress = async (client, employeeId, address) => {

    const allowedFields = {
        addressLine1: "address_line_1",
        addressLine2: "address_line_2",
        city: "city",
        state: "state",
        country: "country",
        postalCode: "postal_code" 
    };

    const fields = [], values = [];
    let idx = 1;

    for(const key in address) {

        if(allowedFields[key]) {
            fields.push(`${allowedFields[key]} = $${idx}`);
            values.push(address[key]);
            idx++;
        }

    }

    if(fields.length === 0) {
        return;
    }

    values.push(employeeId);

    const query = `
        UPDATE employee_addresses
        SET ${fields.join(', ')}
        WHERE employee_id = $${idx}
    `;

    await client.query(query, values);

    return true;
}

// Update salary
const updateSalary = async (client, employeeId, salary) => {

    const allowedFields = {
        basicPay: "basic_pay",
        hra: "hra",
        medical: "medical",
        conveyance: "conveyance",
        specialAllowance: "special_allowances",
        advanceBonus: "advance_bonus",
        companyPf: "company_pf",
        aplc: "aplc",
        providentFund: "provident_fund",
        esi: "esi",
        professionalTax: "professiona_tax",
        totalCtc: "total_ctc",
        grossSalary: "gross_salary",
        totalDeductions: "total_deductions",
        netTakeHome: "net_take_home"
    };

    const fields = [], values = [];
    let idx = 1;

    for(const key in salary) {

        if(allowedFields[key]) {
            fields.push(`${allowedFields[key]} = $${idx}`);
            values.push(salary[key]);
            idx++;
        }

    }

    if(fields.length === 0) {
        return;
    }

    values.push(employeeId);

    const query = `
        UPDATE salary_structure
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = $${idx}
    `;

    await client.query(query, values);
    return true;

}

// Delete employee -> soft delete
const deleteEmployee = async (client, id) => {

    const query = `
        UPDATE employees
        SET deleted_at = NOW(), status = 'Inactive'
        WHERE id = $1 AND deleted_at IS NULL
    `;

    await client.query(query, [id]);

    return true;
}


module.exports = {
    createEmployee,
    createUser,
    createAddress,
    createSalary,
    assignLeavePolicy,
    initializeAttendanceSummary,
    getEmployees,
    getEmployee,
    updateEmployee, 
    updateAddress,
    updateSalary,
    updateUserEmail,
    deleteEmployee,
};