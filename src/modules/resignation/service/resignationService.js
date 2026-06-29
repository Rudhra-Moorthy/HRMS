const resignationRepo = require('../repository/resignationRepo');
const resignationDto = require('../dto/resignationDto');

const createResignation = async (body) => {

    const result = await resignationRepo.createResignation(body);

    return resignationDto(result);

};

const getAllResignations = async () => {

    const resignations = await resignationRepo.getAllResignations();

    return resignations.map(resignationDto);

};

const getResignationById = async (id) => {

    const resignation = await resignationRepo.getResignationById(id);

    return resignationDto(resignation);

};

const updateResignation = async (id, body) => {

    const result = await resignationRepo.updateResignation(id, body);

    return resignationDto(result);

};

const deleteResignation = async (id) => {

    return await resignationRepo.deleteResignation(id);

};

module.exports = {
    createResignation,
    getAllResignations,
    getResignationById,
    updateResignation,
    deleteResignation
};