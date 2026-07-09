const pool = require("../../../config/db");
const requirementRepo = require("../repository/requirementRepository");
const requirementDto = require("../dto/requirementDto");

// Create Requirement
const createRequirement = async (body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const result = await requirementRepo.createRequirement(client, body);

        await client.query("COMMIT");

        return requirementDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};


// Get All Requirements
const getAllRequirements = async () => {

    const client = await pool.connect();

    try {

        const requirements = await requirementRepo.getRequirements(client);

        return requirements.map(requirementDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};


// Get Requirement By Id
const getRequirementById = async (id) => {

    const client = await pool.connect();

    try {

        const requirement = await requirementRepo.getRequirement(client, id);

        return requirementDto(requirement);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};


// Update Requirement
const updateRequirement = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const requirement = await requirementRepo.getRequirement(client, id);

        if (!requirement) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await requirementRepo.updateRequirement(
            client,
            id,
            body
        );

        await client.query("COMMIT");

        return requirementDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};


// Delete Requirement
const deleteRequirement = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const requirement = await requirementRepo.getRequirement(client, id);

        if (!requirement) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await requirementRepo.deleteRequirement(client, id);

        await client.query("COMMIT");

        return requirementDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
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