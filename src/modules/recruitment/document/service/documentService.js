const documentRepo = require('../repository/documentRepo');
const documentDto = require('../dto/document');

const createDocument = async (body) => {

    const result = await documentRepo.createDocument(body);

    return documentDto(result);

};

const getAllDocuments = async () => {

    const documents = await documentRepo.getAllDocuments();

    return documents.map(documentDto);

};

const getDocumentById = async (id) => {

    const document = await documentRepo.getDocumentById(id);

    return documentDto(document);

};

const getDocumentsByCandidateId = async (candidateId) => {

    const documents = await documentRepo.getDocumentsByCandidateId(candidateId);

    return documents.map(documentDto);

};

const updateDocument = async (id, body) => {

    const result = await documentRepo.updateDocument(id, body);

    return documentDto(result);

};

const deleteDocument = async (id) => {

    return await documentRepo.deleteDocument(id);

};

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    getDocumentsByCandidateId,
    updateDocument,
    deleteDocument
};