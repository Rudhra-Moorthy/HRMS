const { act } = require("react");

/* Get all exit clearances */
const getExitClearances = async (client, filters) => {

    const {
        status,
        departmentId,
        employeeId,
        search,
        page = 1,
        limit = 10,
        sortBy = 'ec.created_at',
        sortedOrder = 'DESC'
    } = filters;

    const values = [];
    let idx = 1;

    let where = `WHERE 1 = 1`;

    if(status) {
        where += `
            AND ec.overall_status = $${idx++}
        `;
        values.push(status);
    }

    if(departmentId) {
        where += `
            AND e.dept_id = $${idx++}
        `;
        values.push(departmentId);
    }

    if(employeeId) {
        where += `
            AND ec.employee_id = $${idx++}
        `;
        values.push(employeeId);
    }

    if(search) {
        where += `
            AND (
                LOWER(e.full_name) LIKE LOWER($${idx})
                OR
                LOWER(e.emp_code) LIKE LOWER($${idx})
            )
        `;
        values.push(`%${search}%`);
        idx++;
    }

    const offset = (page - 1) * limit;
    values.push(limit);
    values.push(offset);

    const allowedSortColumns = {
        employeeName: 'e.full_name',
        employeeCode: 'e.emp_code',
        department: 'd.dept_name',
        status: 'ec.overall_status',
        createdAt: 'ec.created_at',
        completedAt: 'ec.completed_at'
    };

    const orderBy = allowedSortColumns[sortBy] || 'ec.created_at';
    const order = sortedOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const query = `
        SELECT
            ec.id,
            ec.employee_id,
            ec.resignation_id,
            ec.overall_status,
            ec.initiated_at,
            ec.completed_at,
            e.emp_code,
            e.full_name,
            d.dept_name
        FROM exit_clearance ec
        JOIN employees e
            ON e.id = ec.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        ${where}
        ORDER BY ${orderBy} ${order}
        LIMIT $${idx++} OFFSET $${idx++};
    `;

    const result = await client.query(query, values);
    return result.rows;

}

const getExitClearanceCount = async (client, filters) => {

    const {
        status,
        departmentId,
        employeeId,
        search
    } = filters;

    const values = [];
    let idx = 1;

    let where = `WHERE 1=1`;

    if (status) {
        where += `
            AND ec.overall_status = $${idx++}
        `;
        values.push(status);
    }

    if (departmentId) {
        where += `
            AND e.dept_id = $${idx++}
        `;
        values.push(departmentId);
    }

    if (employeeId) {
        where += `
            AND ec.employee_id = $${idx++}
        `;
        values.push(employeeId);
    }

    if (search) {
        where += `
            AND (
                LOWER(e.full_name) LIKE LOWER($${idx})
                OR
                LOWER(e.emp_code) LIKE LOWER($${idx})
            )
        `;
        values.push(`%${search}%`);
        idx++;
    }

    const query = `

        SELECT COUNT(*) total
        FROM exit_clearance ec
        JOIN employees e
            ON e.id = ec.employee_id
        ${where}

    `;

    const result = await client.query(query, values);
    return Number(result.rows[0].total);

};

/* Get exit clearance by id */
const getExitClearance = async (client, clearanceId) => {

    const query = `
        SELECT
            ec.*,
            e.emp_code,
            e.full_name,
            d.dept_name
        FROM exit_clearance ec
        JOIN employees e
            ON e.id = ec.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        WHERE ec.id = $1;
    `;

    const result = await client.query(query, [clearanceId]);
    return result.rows[0];

}

/* Get employee exit clearance */
const getEmployeeExitClearance = async (client, employeeId) => {

    const query = `
        SELECT 
            ec.*,
            e.emp_code,
            e.full_name,
            d.dept_name
        FROM exit_clearance ec
        JOIN employees e
            ON e.id = ec.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        WHERE ec.employee_id = $1
        ORDER BY ec.created_at DESC
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);
    return result.rows[0];

}

/* Get exit clearance tasks */
const getExitClearanceTasks = async (client, clearanceId) => {

    const query = `
        SELECT
            ect.id,
            ect.clearance_id,
            ect.dept_id,
            ect.assigned_to,
            ect.task_name,
            ect.task_type,
            ect.status,
            ect.remarks,
            ect.completed_at,
            d.dept_name,
            e.full_name AS assigned_to_name
        FROM exit_clearance_tasks ect
        LEFT JOIN departments d
            ON d.id = ect.dept_id
        LEFT JOIN employees e
            ON e.id = ect.assigned_to
        WHERE ect.clearance_id = $1
        ORDER BY ect.id;
    `;

    const result = await client.query(query, [clearanceId]);
    return result.rows;

};

/* EXit clearance tasks */
const getExitClearanceAssets = async (client, clearanceId) => {

    const query = `
        SELECT
            eca.id,
            ca.asset_name,
            ca.asset_code,
            eca.returned,
            eca.returned_date,
            eca.condition,
            eca.remarks
        FROM exit_clearance_assets eca
        JOIN company_assets ca
            ON ca.asset_id = eca.asset_id
        WHERE eca.clearance_id = $1
        ORDER BY ca.asset_name;
    `;

    const result = await client.query(query, [clearanceId]);
    return result.rows;

};

/* Get Pending Tasks */
const getPendingTasks = async (client, employeeId) => {

    const query = `
        SELECT
            ect.id,
            ect.clearance_id,
            ect.dept_id,
            ect.task_name,
            ect.task_type,
            ect.status,
            d.dept_name
        FROM exit_clearance_tasks ect
        LEFT JOIN departments d
            ON d.id = ect.dept_id
        WHERE 
            ect.assigned_to = $1 AND
            ect.status = 'PENDING'
        ORDER BY ect.created_at;
    `;

    const result = await client.query(query, [employeeId]);
    return result.rows;

}

/* Get task */
const getTask = async (client, taskId) => {

    const query = `
        SELECT 
            ect.*,
            ec.employee_id,
            e.full_name,
            d.dept_name
        FROM exit_clearance_tasks ect
        JOIN exit_clearance ec
            ON ec.id = ect.clearance_id
        JOIN employees e
            ON e.id = ec.employee_id
        LEFT JOIN departments d
            ON d.id = ect.dept_id
        WHERE ect.id = $1;
    `;

    const result = await client.query(query, [taskId]);
    return result.rows[0];
}

/* Approve task */
const approveTask = async (client, taskId, approverId, remarks) => {

    const query = `
        UPDATE exit_clearance_tasks
        SET 
            status = 'APPROVED',
            approved_by = $2,
            approved_at = NOW(),
            remarks = $3,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [taskId, approverId, remarks]);
}

/* Reject task */
const rejectTask = async (client, taskId, approverId, remarks) => {

    const query = `
        UPDATE exit_clearance_tasks
        SET
            status = 'REJECTED',
            approved_by = $2,
            approved_at = NOW(),
            remarks = $3,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [taskId,approverId,remarks]);
    return result.rows[0];

};

/* Ckeck pending tasks */
const checkPendingTasks = async (client, clearanceId) => {

    const query = `
        SELECT COUNT(*) total
        FROM exit_clearance_tasks
        WHERE
            clearance_id = $1
            AND status = 'PENDING';
    `;

    const result = await client.query(query, [clearanceId]);
    return Number(result.rows[0].total);

};

/* Check pending assets */
const checkPendingAssets = async (client, clearanceId) => {

    const query = `
        SELECT COUNT(*) total
        FROM exit_clearance_assets
        WHERE
            clearance_id = $1
            AND returned = FALSE;
    `;

    const result = await client.query(query, [clearanceId]);

    return Number(result.rows[0].total);

};

/* Complete Exit clearance */
const completeExitClearance = async (client, clearanceId) => {

    const query = `
        UPDATE exit_clearance
        SET
            overall_status = 'COMPLETED',
            completed_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [clearanceId]);

    return result.rows[0];

};

/* Log History */
const logHistory = async (client, clearanceId, taskId, action, actionBy, oldStatus, newStatus, remarks) => {

    const query = `
        INSERT INTO exit_clearance_history (
            clearance_id,
            task_id,
            action,
            action_by,
            old_status,
            new_status,
            remarks
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

    const values = [clearanceId, taskId, action, actionBy, oldStatus, newStatus, remarks];

    await client.query(query, values);

}

/* Complete Exit clearance */
const completeExitClearance = async (client, clearanceId) => {

    const query = `
        UPDATE exit_clearance
        SET
            overall_status = 'COMPLETED',
            completed_at = NOW(),
            updated_at = NOW(),
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [clearanceId]);
    return result.rows[0];

}

module.exports = {
    getExitClearances,
    getExitClearance,
    getEmployeeExitClearance,
    getPendingTasks,
    getTask,
    getExitClearanceCount,
    getExitClearanceTasks,
    getExitClearanceAssets,
    approveTask,
    rejectTask,
    checkPendingTasks,
    logHistory,
    checkPendingAssets,
    completeExitClearance,
    completeExitClearance
};