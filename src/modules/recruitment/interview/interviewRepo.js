// Create Interview
const createInterview = async (client, interview) => {

    const query = `
        INSERT INTO interview_schedules (
            candidate_id,
            interviewer_id,
            interview_type,
            interview_date,
            start_time,
            end_time,
            meeting_link,
            status,
            feedback
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING *;
    `;

    const values = [
        interview.candidateId,
        interview.interviewerId,
        interview.interviewType,
        interview.interviewDate,
        interview.startTime,
        interview.endTime,
        interview.meetingLink,
        interview.status || "Scheduled",
        interview.feedback
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


// Get All Interviews
const getInterviews = async (client) => {

    const query = `
        SELECT *
        FROM interview_schedules
        WHERE deleted_at IS NULL
        ORDER BY interview_date ASC, start_time ASC;
    `;

    const result = await client.query(query);

    return result.rows;

};


// Get Interview By Id
const getInterview = async (client, id) => {

    const query = `
        SELECT *
        FROM interview_schedules
        WHERE id = $1
        AND deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


// Update Interview
const updateInterview = async (client, id, payload) => {

    const allowedFields = {
        candidateId: "candidate_id",
        interviewerId: "interviewer_id",
        interviewType: "interview_type",
        interviewDate: "interview_date",
        startTime: "start_time",
        endTime: "end_time",
        meetingLink: "meeting_link",
        status: "status",
        feedback: "feedback"
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
        UPDATE interview_schedules
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


// Soft Delete Interview
const deleteInterview = async (client, id) => {

    const query = `
        UPDATE interview_schedules
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
    createInterview,
    getInterviews,
    getInterview,
    updateInterview,
    deleteInterview
};