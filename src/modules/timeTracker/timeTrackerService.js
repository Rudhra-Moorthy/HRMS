const pool = require('../../config/db');
const timeTrackerRepo = require('./timeTrackerRepo');
const timeEntryDto = require('./timeEntryDto');

// Create Time Entry
const createTimeEntry = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await timeTrackerRepo.createTimeEntry(client, body);

        await client.query('COMMIT');

        return timeEntryDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

// Get All Time Entries
const getAllTimeEntries = async () => {

    const client = await pool.connect();

    try {

        const timeEntries = await timeTrackerRepo.getAllTimeEntries(client);

        return timeEntries.map(timeEntryDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

// Get Time Entry By Id
const getTimeEntryById = async (id) => {

    const client = await pool.connect();

    try {

        const timeEntry = await timeTrackerRepo.getTimeEntryById(client, id);

        return timeEntryDto(timeEntry);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

// Update Time Entry
const updateTimeEntry = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const timeEntry = await timeTrackerRepo.getTimeEntryById(client, id);

        if (!timeEntry) {

            await client.query('ROLLBACK');
            return null;

        }

        const result = await timeTrackerRepo.updateTimeEntry(client, id, body);

        await client.query('COMMIT');

        return timeEntryDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

// Delete Time Entry
const deleteTimeEntry = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const timeEntry = await timeTrackerRepo.getTimeEntryById(client, id);

        if (!timeEntry) {

            await client.query('ROLLBACK');
            return null;

        }

        const result = await timeTrackerRepo.deleteTimeEntry(client, id);

        await client.query('COMMIT');

        return result;

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

// Get Employee Timesheet
const getTimesheet = async (employeeId) => {

    const client = await pool.connect();

    try {

        const result = await timeTrackerRepo.getTimesheet(client, employeeId);

        return result.map(timeEntryDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

module.exports = {
    createTimeEntry,
    getAllTimeEntries,
    getTimeEntryById,
    updateTimeEntry,
    deleteTimeEntry,
    getTimesheet
};