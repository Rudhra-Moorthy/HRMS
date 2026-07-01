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
            employment_category_id,
            date_of_joining,
            salary,
            status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Active')
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
        employee.employmentCategoryId,
        employee.joinDate,
        employee.salary
    ];

    const result = await client.query(query, values);
    return result.rows[0];

}

// User Table
const createUser = async (client, user) => {

    const query = `
        INSERT INTO users (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [user.email, user.password, user.roleId];

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
            company_pf,
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

/*
    This gets the policies that are assigned to the respective employment category
*/
const getActiveLeavePoliciesByCategory = async (client, employmentCategoryId) => {

    const query = `
        SELECT 
            policy_id, 
            leave_id,
            annual_quota,
            monthly_accrual
        FROM leave_policy
        WHERE employment_category_id = $1 AND 
            effective_from <= CURRENT_DATE AND
            (effective_to IS NULL OR effective_to >= CURRENT_DATE)
        ORDER BY leave_id; 
    `;

    const result = await client.query(query, [employmentCategoryId]);
    return result.rows;

}

/*
    Create employee leave balances
*/
const createEmployeeLeaveBalances = async(client, employeeId, policies) => {

    for(const policy of policies) {

        const query = `
            INSERT INTO employee_leave_balances (
                employee_id,
                leave_id,
                policy_id,
                opening_balance,
                earned_leave,
                used_leave,
                available_leave,
                year,
                effective_from,
                effective_to,
                created_at
            )
            VALUES ($1, $2, $3, $4, 0, 0, $4, EXTRACT(YEAR FROM CURRENT_DATE), CURRENT_DATE, NULL, NOW());
        `;

        const values = [employeeId, policy.leave_id, policy.policy_id, policy.annual_quota];
        await client.query(query, values);

    }

}


/*
    Initializ leave accruals
*/
const initializeLeaveAccruals = async (client, employeeId, policies) => {

    for(const policy of policies) {

        if(Number(policy.monthly_accrual) <= 0) {
            continue;
        }

        const query = `
            INSERT INTO leave_accruals (
                employee_id,
                policy_id,
                leave_id,
                credited_days,
                accrual_date,
                remarks,
                effective_from,
                effective_to,
                created_at
            )
            VALUES ($1, $2, $3, 0, CURRENT_DATE, 'Employee Onboarding', CURRENT_DATE, NULL, NOW()); 
        `;

        const values = [employeeId, policy.policy_id, policy.leave_id];

        await client.query(query, values);

    }

}

// Get User by email
const findUserByEmail = async (client, email) => {

    const query =  `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await client.query(query, [email]);
    return result.rows[0];

}

// Get All Employees
const getEmployees = async (client) => {

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
            s.company_pf,
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
            ON e.dept_id = d.id
        JOIN designations ds
            ON e.desg_id = ds.id
        JOIN salary_structure s
            ON e.id = s.emp_id
        JOIN employee_addresses ea
            ON e.id = ea.employee_id
        WHERE e.deleted_at IS NULL;
    `;

    const result = await client.query(query);
    
    return result.rows;
}

// Get Employee by id
const getEmployee = async (client, id) => {

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
            s.company_pf,
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
            ON e.dept_id = d.id
        JOIN designations ds
            ON e.desg_id = ds.id
        JOIN salary_structure s
            ON e.id = s.emp_id
        JOIN employee_addresses ea
            ON e.id = ea.employee_id
        WHERE e.id = $1 AND e.deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

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
        employmentCategoryId: "employment_category_id",
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
    values.push(id);

    const query = `
        UPDATE employees 
        SET 
            ${fields.join(', ')}, 
            updated_at = NOW()
        WHERE id = $${idx};
    `;

    const result = await client.query(query, values);

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
        professionalTax: "professional_tax",
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

/*
    Update leave policy after Employment Category Changes
    Ex: Intern -> Permanent 
*/
/* 1. Close Current Leave Balances */
const closeCurrentLeaveBalances = async (client, employeeId) => {

    const query = `
        UPDATE employee_leave_balance
        SET
            effective_to = CURRENT_DATE - INTERVAL '1 day',
            updated_at = NOW()
        WHERE employee_id = $1 AND effective_to IS NULL;
    `;

    await client.query(query, [employeeId]);
}

const closeCurrentLeaveAccruals = async (client, employeeId) => {

    const query = `
        UPDATE leave_accruals
        SET
            effective_to = CURRENT_DATE - INTERVAL '1 day',
            updated_at = NOW(),
            remarks = CONCAT(COALESCE(remarks, ''), ' | Closed due to Employment Category Change')
        WHERE employee_id = $1 AND effective_to IS NULL;
    `;

    await client.query(query,[employeeId]);

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

/* 
    Delete user from the users table -> soft delete
*/
const deleteUser = async (client, userId) => {

    const query = `
        UPDATE users
        SET 
            is_active = FALSE, 
            updated_at = NOW(),
            deleted_at = NOW()
        WHERE id = $1;
    `;

    await client.query(query, [userId]);

}


module.exports = {
    createEmployee,
    createUser,
    createAddress,
    createSalary,
    getActiveLeavePoliciesByCategory,
    createEmployeeLeaveBalances,
    initializeLeaveAccruals,
    getEmployees,
    getEmployee,
    findUserByEmail,
    updateEmployee, 
    updateAddress,
    updateSalary,
    updateUserEmail,
    closeCurrentLeaveBalances,
    closeCurrentLeaveAccruals,
    deleteEmployee,
    deleteUser,
};