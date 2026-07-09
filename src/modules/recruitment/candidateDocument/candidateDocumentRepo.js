// Create Document
const createDocument = async (client, document) => {

    const query = `
        INSERT INTO candidate_documents (
            candidate_id,
            document_name,
            document_type,
            file_url
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [
        document.candidateId,
        document.documentName,
        document.documentType,
        document.fileUrl
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

// Get All Documents
const getDocuments = async (client) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE deleted_at IS NULL
        ORDER BY uploaded_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;

};

// Get Document By Id
const getDocument = async (client, id) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE id = $1
        AND deleted_at IS NULL;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

// Get Documents By Candidate Id
const getDocumentsByCandidateId = async (client, candidateId) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE candidate_id = $1
        AND deleted_at IS NULL
        ORDER BY uploaded_at DESC;
    `;

    const result = await client.query(query, [candidateId]);

    return result.rows;

};

// Update Document
const updateDocument = async (client, id, payload) => {

    const allowedFields = {
        candidateId: "candidate_id",
        documentName: "document_name",
        documentType: "document_type",
        fileUrl: "file_url"
    };

    const fields = [];
    const values = [];

    let idx = 1;

    for (const key in payload) {

        if (allowedFields[key]) {

            fields.push(`${allowedFields[key]} = $${idx}`);
            values.push(payload[key]);
            idx++;

        }

    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const query = `
        UPDATE candidate_documents
        SET
            ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = $${idx}
        AND deleted_at IS NULL
        RETURNING *;
    `;

    const result = await client.query(query, values);

    return result.rows[0];

};

// Soft Delete Document
const deleteDocument = async (client, id) => {

    const query = `
        UPDATE candidate_documents
        SET
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        AND deleted_at IS NULL
        RETURNING *;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};

module.exports = {
    createDocument,
    getDocuments,
    getDocument,
    getDocumentsByCandidateId,
    updateDocument,
    deleteDocument
};