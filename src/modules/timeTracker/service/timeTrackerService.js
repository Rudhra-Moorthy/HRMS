const pool = require('../../../config/db');
const timeTrackerRepo = require('../repository/timeTrackerRepo');
const timeEntryDto = require('../dto/timeEntry');

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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const timeEntries = await timeTrackerRepo.getAllTimeEntries(client);
        await client.query('COMMIT');
        return timeEntries.map(timeEntryDto);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getTimeEntryById = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const timeEntry = await timeTrackerRepo.getTimeEntryById(client, id);
        await client.query('COMMIT');
        return timeEntryDto(timeEntry);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await timeTrackerRepo.getTimesheet(client, employeeId);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
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