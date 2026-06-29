const pool = require('../../../../config/db');

const createRequest = async (request) => {

    const query = `
        INSERT INTO attendance_regularizations
        (
            attendance_id,
            employee_id,
            regularization_date,
            request_type,
            reason,
            requested_check_in,
            requested_check_out
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *;
    `;

    const values = [
        request.attendance_id,
        request.employee_id,
        request.regularization_date,
        request.request_type,
        request.reason,
        request.requested_check_in,
        request.requested_check_out
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};
const getAllRequests = async () => {

    const result = await pool.query(`
        SELECT *
        FROM attendance_regularizations
        ORDER BY created_at DESC
    `);

    return result.rows;
};
const getRequestById = async (id) => {

    const result = await pool.query(
        `
        SELECT *
        FROM attendance_regularizations
        WHERE id=$1
        `,
        [id]
    );

    return result.rows[0];
};
const approveRequest = async (id, approvedBy) => {

    const query = `
        UPDATE attendance_regularizations
        SET
            status='Approved',
            approved_by=$1,
            approved_at=NOW(),
            updated_at=NOW()
        WHERE id=$2
        RETURNING *;
    `;

    const result = await pool.query(query, [approvedBy, id]);

    return result.rows[0];
};
const rejectRequest = async (id, reason) => {

    const query = `
        UPDATE attendance_regularizations
        SET
            status='Rejected',
            rejected_reason=$1,
            updated_at=NOW()
        WHERE id=$2
        RETURNING *;
    `;

    const result = await pool.query(query, [reason, id]);

    return result.rows[0];
};
const updateAttendance = async (regularizationId) => {

    const query = `
        UPDATE attendances
        SET
            check_in_time = r.requested_check_in,
            check_out_time = r.requested_check_out,
            attendance_status = 'Present',
            updated_at = NOW()
        FROM attendance_regularizations r
        WHERE
            attendances.id = r.attendance_id
            AND r.id = $1
        RETURNING attendances.*;
    `;

    const result = await pool.query(query, [regularizationId]);

    return result.rows[0];
};
module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    updateAttendance
};