const pool = require('../../../../config/db');
const candidateRepo = require('../repository/ candidateRepo');
const candidateDto = require('../dto/candidate');

const createCandidate = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await candidateRepo.createCandidate(client, body);

        await client.query('COMMIT');

        return candidateDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getAllCandidates = async () => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const candidates = await candidateRepo.getAllCandidates(client);

        await client.query('COMMIT');

        return candidates.map(candidateDto);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getCandidateById = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const candidate = await candidateRepo.getCandidateById(client, id);

        await client.query('COMMIT');

        return candidateDto(candidate);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const updateCandidate = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await candidateRepo.updateCandidate(client, id, body);

        await client.query('COMMIT');

        return candidateDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const deleteCandidate = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await candidateRepo.deleteCandidate(client, id);

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
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};