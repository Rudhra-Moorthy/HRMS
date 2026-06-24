const pool = require('../../../config/db');

const createDocument = async (document) => {

    const query = `
        INSERT INTO candidate_documents
        (
            candidate_id,
            document_type,
            file_url,
            uploaded_at
        )
        VALUES
        ($1,$2,$3,NOW())
        RETURNING *;
    `;

    const values = [
        document.candidate_id,
        document.document_type,
        document.file_url
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


const getAllDocuments = async () => {

    const query = `
        SELECT *
        FROM candidate_documents
        ORDER BY uploaded_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

};


const getDocumentById = async (id) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE id=$1;
    `;

    const result = await pool.query(query,[id]);

    return result.rows[0];

};


const getDocumentsByCandidateId = async (candidateId) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE candidate_id=$1;
    `;

    const result = await pool.query(query,[candidateId]);

    return result.rows;

};


const updateDocument = async (id, document) => {

    const query = `
        UPDATE candidate_documents
        SET
            document_type=$1,
            file_url=$2
        WHERE id=$3
        RETURNING *;
    `;

    const values = [
        document.document_type,
        document.file_url,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};


const deleteDocument = async (id) => {

    const query = `
        DELETE FROM candidate_documents
        WHERE id=$1
        RETURNING *;
    `;

    const result = await pool.query(query,[id]);

    return result.rows[0];

};

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    getDocumentsByCandidateId,
    updateDocument,
    deleteDocument
};