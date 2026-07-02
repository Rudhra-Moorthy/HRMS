const pool = require('../../../config/db');
const interviewRepo = require('./interviewRepo');
const interviewDto = require('./interview');

const createInterview = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await interviewRepo.createInterview(client, body);

        await client.query('COMMIT');

        return interviewDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getAllInterviews = async () => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const interviews = await interviewRepo.getAllInterviews(client);

        await client.query('COMMIT');

        return interviews.map(interviewDto);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getInterviewById = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const interview = await interviewRepo.getInterviewById(client, id);

        await client.query('COMMIT');

        return interviewDto(interview);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const updateInterview = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await interviewRepo.updateInterview(client, id, body);

        await client.query('COMMIT');

        return interviewDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const deleteInterview = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await interviewRepo.deleteInterview(client, id);

        await client.query('COMMIT');

        return result;

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

module.exports = {
    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};