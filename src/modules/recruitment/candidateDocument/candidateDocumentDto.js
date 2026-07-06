const documentDto = (document) => {

    if (!document) {
        return null;
    }

    return {
        id: document.id,
        candidateId: document.candidate_id,
        documentName: document.document_name,
        documentType: document.document_type,
        fileUrl: document.file_url,
        uploadedAt: document.uploaded_at,
        updatedAt: document.updated_at
    };

};

module.exports = documentDto;