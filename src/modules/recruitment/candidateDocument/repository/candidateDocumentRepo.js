
const createDocument = async (client,document) => {

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

    const result = await client.query(query, values);

    return result.rows[0];
};


const getAllDocuments = async (client) => {

    const query = `
        SELECT *
        FROM candidate_documents
        ORDER BY uploaded_at DESC;
    `;

    const result = await client.query(query);

    return result.rows;


};


const getDocumentById = async (client, id) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE id=$1;
    `;

    const result = await client.query(query,[id]);

    return result.rows[0];

};


const getDocumentsByCandidateId = async (client, candidateId) => {

    const query = `
        SELECT *
        FROM candidate_documents
        WHERE candidate_id=$1;
    `;

    const result = await client.query(query,[candidateId]);

    return result.rows;

};


const updateDocument = async (client, id, document) => {

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

    const result = await client.query(query, values);

    return result.rows[0];

};


const deleteDocument = async (client,id) => {

    const query = `
        DELETE FROM candidate_documents
        WHERE id=$1
        RETURNING *;
    `;

    const result = await client.query(query,[id]);

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