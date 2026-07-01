const pool = require('../../../config/db');

const createRequirement = async (requirement,client) => {

    const query = `
        INSERT INTO requirements
        (
            requirement_code,
            position,
            dept_id,
            vacancies,
            experience_required,
            job_description,
            priority,
            status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
    `;

    const values = [
        requirement.requirement_code,
        requirement.position,
        requirement.dept_id,
        requirement.vacancies,
        requirement.experience_required,
        requirement.job_description,
        requirement.priority,
        requirement.status
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


const getAllRequirements = async (client) => {

    const query = `
        SELECT *
        FROM requirements
        ORDER BY created_at DESC
    `;

    const result = await client.query(query);

    return result.rows;
};


const getRequirementById = async (id, client) => {

    const query = `
        SELECT *
        FROM requirements
        WHERE id=$1
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];
};


const updateRequirement = async (id, requirement, client) => {

    const query = `
        UPDATE requirements
        SET
            position=$1,
            dept_id=$2,
            vacancies=$3,
            experience_required=$4,
            job_description=$5,
            priority=$6,
            status=$7,
            updated_at=NOW()
        WHERE id=$8
        RETURNING *;
    `;

    const values = [
        requirement.position,
        requirement.dept_id,
        requirement.vacancies,
        requirement.experience_required,
        requirement.job_description,
        requirement.priority,
        requirement.status,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


const deleteRequirement = async (id, client) => {

    const query = `
        DELETE FROM requirements
        WHERE id=$1
        RETURNING *
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];
};


module.exports = {
    createRequirement,
    getAllRequirements,
    getRequirementById,
    updateRequirement,
    deleteRequirement
};