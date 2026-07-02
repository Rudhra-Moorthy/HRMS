const pool = require('../../../config/db');
const requirementRepo = require('../repository/requirementRepository');
const requirementDto = require('../dto/requirementDto');

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

    try {

        const requirements = await requirementRepo.getAllRequirements(pool);
        return requirements.map(requirementDto);

    } catch (err) {
        throw err;

    }

};

const getRequirementById = async (id) => {

    try {

        const requirement = await requirementRepo.getRequirementById(pool, id);
        return requirementDto(requirement);

    } catch (err) {
        throw err;
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