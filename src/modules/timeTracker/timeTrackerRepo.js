// timeTrackerRepo.js

// Create Time Entry
const createTimeEntry = async (client, timeEntry) => {

    const query = `
        INSERT INTO time_tracker (
            employee_id,
            project_name,
            task_name,
            description,
            start_time
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
        timeEntry.employeeId,
        timeEntry.projectName,
        timeEntry.taskName,
        timeEntry.description,
        timeEntry.startTime
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};


// Get All Time Entries
const getAllTimeEntries = async (client) => {

    const query = `
        SELECT *
        FROM time_tracker
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;

};


// Get Time Entry By Id
const getTimeEntryById = async (client, id) => {

    const query = `
        SELECT *
        FROM time_tracker
        WHERE id = $1
        AND deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};


// Update Time Entry
const updateTimeEntry = async (client, id, payload) => {

    const allowedFields = {
        projectName: "project_name",
        taskName: "task_name",
        description: "description",
        startTime: "start_time",
        endTime: "end_time",
        totalHours: "total_hours",
        status: "status"
    };

    const fields = [];
    const values = [];

    let index = 1;

    for (const key in payload) {

        if (allowedFields[key]) {

            fields.push(`${allowedFields[key]} = $${index}`);
            values.push(payload[key]);
            index++;

        }

    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const query = `
        UPDATE time_tracker
        SET
            ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = $${index}
        AND deleted_at IS NULL
        RETURNING *;
    `;

    const result = await client.query(query, values);

    return result.rows[0];

};


// Soft Delete Time Entry
const deleteTimeEntry = async (client, id) => {

    const query = `
        UPDATE time_tracker
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


// Employee Timesheet
const getTimesheet = async (client, employeeId) => {

    const query = `
        SELECT *
        FROM time_tracker
        WHERE employee_id = $1
        AND deleted_at IS NULL
        ORDER BY start_time DESC;
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows;

};

module.exports = {
    createTimeEntry,
    getAllTimeEntries,
    getTimeEntryById,
    updateTimeEntry,
    deleteTimeEntry,
    getTimesheet
};