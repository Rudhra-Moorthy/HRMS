const pool = require("../../../config/db");
const interviewRepo = require("./interviewRepo");
const interviewDto = require("./interviewDto");

// Create Interview
const createInterview = async (body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const result = await interviewRepo.createInterview(client, body);

        await client.query("COMMIT");

        return interviewDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};


// Get All Interviews
const getAllInterviews = async () => {

    const client = await pool.connect();

    try {

        const interviews = await interviewRepo.getInterviews(client);

        return interviews.map(interviewDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};


// Get Interview By Id
const getInterviewById = async (id) => {

    const client = await pool.connect();

    try {

        const interview = await interviewRepo.getInterview(client, id);

        return interviewDto(interview);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};


// Update Interview
const updateInterview = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const interview = await interviewRepo.getInterview(client, id);

        if (!interview) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await interviewRepo.updateInterview(
            client,
            id,
            body
        );

        await client.query("COMMIT");

        return interviewDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};


// Delete Interview
const deleteInterview = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const interview = await interviewRepo.getInterview(client, id);

        if (!interview) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await interviewRepo.deleteInterview(client, id);

        await client.query("COMMIT");

        return interviewDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
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