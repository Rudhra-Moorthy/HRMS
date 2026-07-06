// Create Candidate
const createCandidate = async (client, candidate) => {

    const query = `
        INSERT INTO candidates (
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
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
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
        candidate.status || "Applied"
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

// Get All Candidates
const getCandidates = async (client) => {

    const query = `
        SELECT *
        FROM candidates
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;

};

// Get Candidate By Id
const getCandidate = async (client, id) => {

    const query = `
        SELECT *
        FROM candidates
        WHERE id = $1
        AND deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

// Update Candidate
const updateCandidate = async (client, id, payload) => {

    const allowedFields = {
        requirementId: "requirement_id",
        fullName: "full_name",
        email: "email",
        phoneNumber: "phone",
        experience: "experience",
        currentCompany: "current_company",
        currentCtc: "current_ctc",
        expectedCtc: "expected_ctc",
        noticePeriod: "notice_period",
        skills: "skills",
        resumeUrl: "resume_url",
        status: "status"
    };

    const fields = [];
    const values = [];

    let idx = 1;

    for (const key in payload) {

        if (allowedFields[key]) {

            fields.push(`${allowedFields[key]} = $${idx}`);
            values.push(payload[key]);
            idx++;

        }

    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const query = `
        UPDATE candidates
        SET
            ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = $${idx}
        AND deleted_at IS NULL
        RETURNING *;
    `;

    const result = await client.query(query, values);

    return result.rows[0];

};

// Soft Delete Candidate
const deleteCandidate = async (client, id) => {

    const query = `
        UPDATE candidates
        SET
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        AND deleted_at IS NULL
        RETURNING *;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

module.exports = {
    createCandidate,
    getCandidates,
    getCandidate,
    updateCandidate,
    deleteCandidate
};