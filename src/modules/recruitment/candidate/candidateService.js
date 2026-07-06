const pool = require('../../../config/db');
const candidateRepo = require('./candidateRepo');
const candidateDto = require('./candidateDto');

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
        const candidates = await candidateRepo.getCandidates(client);

        return candidates.map(candidateDto);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

const getCandidateById = async (id) => {
    const client = await pool.connect();

    try {
        const candidate = await candidateRepo.getCandidate(client, id);

        return candidateDto(candidate);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

const updateCandidate = async (id, body) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const candidate = await candidateRepo.getCandidate(client, id);

        if (!candidate) {
            await client.query('ROLLBACK');
            return null;
        }

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

        const candidate = await candidateRepo.getCandidate(client, id);

        if (!candidate) {
            await client.query('ROLLBACK');
            return null;
        }

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