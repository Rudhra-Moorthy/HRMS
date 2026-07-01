const pool = require('../../../config/db');

const createCandidate = async (candidate,client) => {

    const query = `
        INSERT INTO candidates
        (
            requirement_id,
            full_name,
            email,
            phone,
            experience,
            status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *;
    `;

    const values = [
        candidate.requirement_id,
        candidate.full_name,
        candidate.email,
        candidate.phone,
        candidate.experience,
        candidate.status
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


const getAllCandidates = async (client) => {

    const query = `
        SELECT *
        FROM candidates
        ORDER BY created_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;

};


const getCandidateById = async (id, client) => {

    const query = `
        SELECT *
        FROM candidates
        WHERE id = $1;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


const updateCandidate = async (id, candidate, client) => {

    const query = `
        UPDATE candidates
        SET
            requirement_id=$1,
            full_name=$2,
            email=$3,
            phone=$4,
            experience=$5,
            status=$6,
            updated_at=NOW()
        WHERE id=$7
        RETURNING *;
    `;

    const values = [
        candidate.requirement_id,
        candidate.full_name,
        candidate.email,
        candidate.phone,
        candidate.experience,
        candidate.status,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


const deleteCandidate = async (id, client) => {

    const query = `
        DELETE FROM candidates
        WHERE id=$1
        RETURNING *;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};