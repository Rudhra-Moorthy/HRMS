const pool = require('../../config/db');
const timeTrackerRepo = require('./timeTrackerRepo');
const timeEntryDto = require('./timeEntry');

const createTimeEntry = async (body) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await timeTrackerRepo.createTimeEntry(client, body);
        await client.query('COMMIT');
        return timeEntryDto(result);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getAllTimeEntries = async () => {
    try {
        const timeEntries = await timeTrackerRepo.getAllTimeEntries(pool);
        return timeEntries.map(timeEntryDto);
    } catch (error) {
        throw error;
    }
};

const getTimeEntryById = async (id) => {
    try {
        const timeEntry = await timeTrackerRepo.getTimeEntryById(pool, id);
        return timeEntryDto(timeEntry);
    } catch (error) {
        throw error;
    }
};

const updateTimeEntry = async (id, body) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await timeTrackerRepo.updateTimeEntry(client, id, body);
        await client.query('COMMIT');
        return timeEntryDto(result);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteTimeEntry = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await timeTrackerRepo.deleteTimeEntry(client, id);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getTimesheet = async (employeeId) => {
    try {
        const result = await timeTrackerRepo.getTimesheet(pool, employeeId);
        return result;
    } catch (error) {
        throw error;
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