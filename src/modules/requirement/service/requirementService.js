const requirementRepo = require('../repository/requirementRepo');
const requirementDto = require('../dto/requirement');

const createRequirement = async (body) => {

    const result = await requirementRepo.createRequirement(body);

    return requirementDto(result);
};


const getAllRequirements = async () => {

    const requirements = await requirementRepo.getAllRequirements();

    return requirements.map(requirementDto);
};


const getRequirementById = async (id) => {

    const requirement = await requirementRepo.getRequirementById(id);

    return requirementDto(requirement);
};


const updateRequirement = async (id, body) => {

    const result = await requirementRepo.updateRequirement(id, body);

    return requirementDto(result);
};


const deleteRequirement = async (id) => {

    return await requirementRepo.deleteRequirement(id);

};


module.exports = {
    createRequirement,
    getAllRequirements,
    getRequirementById,
    updateRequirement,
    deleteRequirement
};