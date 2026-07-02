
const createCandidate = async (client, candidate) => {

    const query = `
        INSERT INTO candidates
        (
            requirement_id,
            full_name,
            email,
            phone,
            experience,
            current_company,
            current_ctc,
            expected_ctc,
            notice_period,
            skills,
            resume_url,
            status
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *;
    `;

    const values = [
        candidate.requirementId,
        candidate.fullName,
        candidate.email,
        candidate.phoneNumber,
        candidate.experience,
        candidate.currentCompany,
        candidate.currentCtc,
        candidate.expectedCtc,
        candidate.noticePeriod,
        candidate.skills,
        candidate.resumeUrl,
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


const getCandidateById = async (client, id) => {

    const query = `
        SELECT *
        FROM candidates
        WHERE id = $1;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


const updateCandidate = async (client, id, candidate) => {

    const query = `
        UPDATE candidates
        SET
            requirement_id = $1,
            full_name = $2,
            email = $3,
            phone = $4,
            experience = $5,
            current_company = $6,
            current_ctc = $7,
            expected_ctc = $8,
            notice_period = $9,
            skills = $10,
            resume_url = $11,
            status = $12,
            updated_at = NOW()
        WHERE id = $13
        RETURNING *;
    `;

    const values = [
        candidate.requirement_id,
        candidate.full_name,
        candidate.email,
        candidate.phone,
        candidate.experience,
        candidate.current_company,
        candidate.current_ctc,
        candidate.expected_ctc,
        candidate.notice_period,
        candidate.skills,
        candidate.resume_url,
        candidate.status,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


const deleteCandidate = async (client, id) => {

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