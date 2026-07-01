/* Create History */
const createHistory = async (client, dto) => {

    const query = `
        INSERT INTO attendance_regularization_history (
            regularization_id,
            employee_id,
            action,
            action_by,
            remarks,
            old_status,
            new_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [dto.regularizationId, dto.employeeId, dto.action, dto.actionBy, dto.remarks, dto.oldStatus, dto.newStatus];

    const result = await client.query(query, values);
    return result.rows[0];

}

/* History By regularizations */
const getHistory = async (pool, regularizationId) => {

    const query = `
        SELECT 
            ah.history_id,
            ah.action,
            ah.old_status,
            ah.newStatus,
            ah.remarks,
            ah.created_at,
            e.full_name AS employee_name,
            action_by.full_name AS action_by_name
        FROM attendance_regularization_history ah
        JOIN employees e
            ON e.id = ah.employee_id
        JOIN employees action_by
            ON action_by.id = ah.action_by
        WHERE ah.regualrization_id = $1
        ORDER BY ah.created_at ASC;
    `;

    const result = await pool.query(query, [regularizationId]);

    return result.rows;

}

/* Log Method */
const logHistory = async (client, regularizationId, employeeId, action, actionBy, remarks, oldStatus, newStatus) => {

    const query = `
        INSERT INTO attendance_regularization_history (
            regularization_id,
            employee_id,
            action,
            action_by,
            remarks,
            old_status,
            new_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

    const values = [regularizationId, employeeId, action, actionBy, remarks, oldStatus, newStatus];

    await client.query(query, values);

}

module.exports = {
    createHistory, 
    getHistory,
    logHistory
};