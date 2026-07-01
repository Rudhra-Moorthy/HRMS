const pool = require('../../../config/db');
const documentRepo = require('../repository/documentRepo');
const documentDto = require('../dto/document');

const createDocument = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await documentRepo.createDocument(client, body);

        await client.query('COMMIT');

        return documentDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getAllDocuments = async () => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const documents = await documentRepo.getAllDocuments(client);

        await client.query('COMMIT');

        return documents.map(documentDto);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getDocumentById = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const document = await documentRepo.getDocumentById(client, id);

        await client.query('COMMIT');

        return documentDto(document);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const getDocumentsByCandidateId = async (candidateId) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const documents = await documentRepo.getDocumentsByCandidateId(client, candidateId);

        await client.query('COMMIT');

        return documents.map(documentDto);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const updateDocument = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await documentRepo.updateDocument(client, id, body);

        await client.query('COMMIT');

        return documentDto(result);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

const deleteDocument = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await documentRepo.deleteDocument(client, id);

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
    createDocument,
    getAllDocuments,
    getDocumentById,
    getDocumentsByCandidateId,
    updateDocument,
    deleteDocument
};