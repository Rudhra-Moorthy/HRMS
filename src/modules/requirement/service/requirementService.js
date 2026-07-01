const pool = require('../../../config/db');
const requirementRepo = require('../repository/requirementRepo');
const requirementDto = require('../dto/requirement');

const createRequirement = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await requirementRepo.createRequirement(client, body);

        await client.query('COMMIT');

        return requirementDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getAllRequirements = async () => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const requirements = await requirementRepo.getAllRequirements(client);

        await client.query('COMMIT');

        return requirements.map(requirementDto);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getRequirementById = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const requirement = await requirementRepo.getRequirementById(client, id);

        await client.query('COMMIT');

        return requirementDto(requirement);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const updateRequirement = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await requirementRepo.updateRequirement(client, id, body);

        await client.query('COMMIT');

        return requirementDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const deleteRequirement = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await requirementRepo.deleteRequirement(client, id);

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
    createRequirement,
    getAllRequirements,
    getRequirementById,
    updateRequirement,
    deleteRequirement
};