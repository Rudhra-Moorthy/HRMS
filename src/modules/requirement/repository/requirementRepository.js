// Create Requirement
const createRequirement = async (client, requirement) => {

    const query = `
        INSERT INTO requirements (
            requirement_code,
            position,
            dept_id,
            vacancies,
            experience_required,
            job_description,
            priority,
            status
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
    `;

    const values = [
        requirement.requirementCode,
        requirement.position,
        requirement.departmentId,
        requirement.vacancies,
        requirement.experienceRequired,
        requirement.jobDescription,
        requirement.priority,
        requirement.status || "OPEN"
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


// Get All Requirements
const getRequirements = async (client) => {

    const query = `
        SELECT *
        FROM requirements
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;

};


// Get Requirement By Id
const getRequirement = async (client, id) => {

    const query = `
        SELECT *
        FROM requirements
        WHERE id = $1
        AND deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


// Update Requirement
const updateRequirement = async (client, id, payload) => {

    const allowedFields = {
        requirementCode: "requirement_code",
        position: "position",
        departmentId: "dept_id",
        vacancies: "vacancies",
        experienceRequired: "experience_required",
        jobDescription: "job_description",
        priority: "priority",
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
        UPDATE requirements
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


// Soft Delete Requirement
const deleteRequirement = async (client, id) => {

    const query = `
        UPDATE requirements
        SET
            status = 'CLOSED',
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
    createRequirement,
    getRequirements,
    getRequirement,
    updateRequirement,
    deleteRequirement
};