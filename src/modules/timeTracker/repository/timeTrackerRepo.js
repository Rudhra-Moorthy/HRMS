const createTimeEntry = async (client,timeEntry) => {

    const query = `
        INSERT INTO time_tracker
        (
            employee_id,
            attendance_id,
            project_name,
            task_name,
            description,
            start_time,
            end_time,
            total_hours
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
    `;

    const values = [
        timeEntry.employee_id,
        timeEntry.attendance_id,
        timeEntry.project_name,
        timeEntry.task_name,
        timeEntry.description,
        timeEntry.start_time,
        timeEntry.end_time,
        timeEntry.total_hours
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getAllTimeEntries = async (client) => {

    const query = `
        SELECT *
        FROM time_tracker
        ORDER BY created_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;
};

const getTimeEntryById = async (client, id) => {

    const query = `
        SELECT *
        FROM time_tracker
        WHERE id = $1;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];
};

const updateTimeEntry = async (client, id, timeEntry) => {

    const query = `
        UPDATE time_tracker
        SET
            project_name = $1,
            task_name = $2,
            description = $3,
            start_time = $4,
            end_time = $5,
            total_hours = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING *;
    `;

    const values = [
        timeEntry.project_name,
        timeEntry.task_name,
        timeEntry.description,
        timeEntry.start_time,
        timeEntry.end_time,
        timeEntry.total_hours,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const deleteTimeEntry = async (client, id) => {

    const query = `
        DELETE FROM time_tracker
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];
};
const getTimesheet = async (client, employeeId) => {

    const query = `
        SELECT
            te.id,
            e.full_name,
            te.project_name,
            te.task_name,
            te.description,
            te.start_time,
            te.end_time,
            te.total_hours
        FROM time_tracker te
        JOIN employees e
            ON te.employee_id = e.id
        WHERE te.employee_id = $1
        ORDER BY te.start_time DESC;
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