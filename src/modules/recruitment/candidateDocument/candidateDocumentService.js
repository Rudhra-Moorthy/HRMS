const pool = require("../../../config/db");
const documentRepo = require("./candidateDocumentRepo");
const documentDto = require("./candidateDocumentDto");

// Create Document
const createDocument = async (body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const result = await documentRepo.createDocument(client, body);

        await client.query("COMMIT");

        return documentDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};

// Get All Documents
const getAllDocuments = async () => {

    const client = await pool.connect();

    try {

        const documents = await documentRepo.getDocuments(client);

        return documents.map(documentDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

// Get Document By Id
const getDocumentById = async (id) => {

    const client = await pool.connect();

    try {

        const document = await documentRepo.getDocument(client, id);

        return documentDto(document);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

// Get Documents By Candidate Id
const getDocumentsByCandidateId = async (candidateId) => {

    const client = await pool.connect();

    try {

        const documents = await documentRepo.getDocumentsByCandidateId(
            client,
            candidateId
        );

        return documents.map(documentDto);

    } catch (err) {

        throw err;

    } finally {

        client.release();

    }

};

// Update Document
const updateDocument = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const document = await documentRepo.getDocument(client, id);

        if (!document) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await documentRepo.updateDocument(
            client,
            id,
            body
        );

        await client.query("COMMIT");

        return documentDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

};

// Delete Document
const deleteDocument = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const document = await documentRepo.getDocument(client, id);

        if (!document) {

            await client.query("ROLLBACK");
            return null;

        }

        const result = await documentRepo.deleteDocument(
            client,
            id
        );

        await client.query("COMMIT");

        return documentDto(result);

    } catch (err) {

        await client.query("ROLLBACK");
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