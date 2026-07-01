const pool = require('../../../config/db');

const createResignation = async (resignation,client) => {

    const query = `
        INSERT INTO resignations
        (
            employee_id,
            resignation_date,
            last_working_day,
            reason,
            status,
            approved_by,
            approved_at,
            remarks
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
    `;

    const values = [
        resignation.employee_id,
        resignation.resignation_date,
        resignation.last_working_day,
        resignation.reason,
        resignation.status,
        resignation.approved_by,
        resignation.approved_at,
        resignation.remarks
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

const getAllResignations = async (client) => {

    const result = await client.query(`
        SELECT *
        FROM resignations
        ORDER BY created_at DESC
    `);

    return result.rows;

};

const getResignationById = async (id,client) => {

    const result = await client.query(
        `SELECT * FROM resignations WHERE id=$1`,
        [id]
    );

    return result.rows[0];

};

const updateResignation = async (id, resignation, client) => {

    const query = `
        UPDATE resignations
        SET
            resignation_date=$1,
            last_working_day=$2,
            reason=$3,
            status=$4,
            approved_by=$5,
            approved_at=$6,
            remarks=$7,
            updated_at=NOW()
        WHERE id=$8
        RETURNING *;
    `;

    const values = [
        resignation.resignation_date,
        resignation.last_working_day,
        resignation.reason,
        resignation.status,
        resignation.approved_by,
        resignation.approved_at,
        resignation.remarks,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

const deleteResignation = async (id, client) => {

    const result = await client.query(
        `
        DELETE FROM resignations
        WHERE id=$1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];

};

module.exports = {
    createResignation,
    getAllResignations,
    getResignationById,
    updateResignation,
    deleteResignation
};