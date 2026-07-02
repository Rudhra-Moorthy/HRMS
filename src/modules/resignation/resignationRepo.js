
const createResignation = async (client, resignation) => {

    const query = `
        INSERT INTO resignations
        (
            employee_id,
            resignation_date,
            last_working_day,
            reason,
            additional_details
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *;
    `;

    const values = [
        resignation.employeeId,
        resignation.resignationDate,
        resignation.lastWorkingDay,
        resignation.reason,
        resignation.additionalDetails
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

const getResignationById = async (client, id) => {

    const result = await client.query(
        `SELECT * FROM resignations WHERE id=$1`,
        [id]
    );

    return result.rows[0];

};

const updateResignation = async (client, id, resignation) => {

    const query = `
        UPDATE resignations
        SET
            status=$1,
            approved_by=$2,
            approved_at=NOW(),
            remarks=$3,
            updated_at=NOW()
        WHERE id=$8
        RETURNING *;
    `;

    const values = [
        resignation.status,
        resignation.approvedBy,
        resignation.remarks,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

const deleteResignation = async (client, id) => {

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