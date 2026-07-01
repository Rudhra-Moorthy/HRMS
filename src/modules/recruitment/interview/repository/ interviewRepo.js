
const createInterview = async (client, interview) => {

    const query = `
        INSERT INTO interview_schedules
        (
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
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *;
    `;

    const values = [
        interview.candidate_id,
        interview.interviewer_id,
        interview.interview_type,
        interview.interview_date,
        interview.start_time,
        interview.end_time,
        interview.meeting_link,
        interview.status,
        interview.feedback
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


const getAllInterviews = async (client) => {

    const query = `
        SELECT *
        FROM interview_schedules
        ORDER BY interview_date;
    `;

    const result = await client.query(query);

    return result.rows;

};


const getInterviewById = async (client, id) => {

    const query = `
        SELECT *
        FROM interview_schedules
        WHERE id=$1;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


const updateInterview = async (client, id, interview) => {

    const query = `
        UPDATE interview_schedules
        SET
            candidate_id=$1,
            interviewer_id=$2,
            interview_type=$3,
            interview_date=$4,
            start_time=$5,
            end_time=$6,
            meeting_link=$7,
            status=$8,
            feedback=$9
        WHERE id=$10
        RETURNING *;
    `;

    const values = [
        interview.candidate_id,
        interview.interviewer_id,
        interview.interview_type,
        interview.interview_date,
        interview.start_time,
        interview.end_time,
        interview.meeting_link,
        interview.status,
        interview.feedback,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


const deleteInterview = async (client, id) => {

    const query = `
        DELETE FROM interview_schedules
        WHERE id=$1
        RETURNING *;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

module.exports = {
    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};