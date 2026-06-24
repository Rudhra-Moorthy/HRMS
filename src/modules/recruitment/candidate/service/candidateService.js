const candidateRepo = require('../repository/candidateRepo');
const candidateDto = require('../dto/candidate');

const createCandidate = async (body) => {

    const result = await candidateRepo.createCandidate(body);

    return candidateDto(result);

};

const getAllCandidates = async () => {

    const candidates = await candidateRepo.getAllCandidates();

    return candidates.map(candidateDto);

};

const getCandidateById = async (id) => {

    const candidate = await candidateRepo.getCandidateById(id);

    return candidateDto(candidate);

};

const updateCandidate = async (id, body) => {

    const result = await candidateRepo.updateCandidate(id, body);

    return candidateDto(result);

};

const deleteCandidate = async (id) => {

    return await candidateRepo.deleteCandidate(id);

};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};