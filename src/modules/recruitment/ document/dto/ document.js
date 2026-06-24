const documentDto = (document) => {

    if (!document) return null;

    return {
        id: document.id,
        candidateId: document.candidate_id,
        documentType: document.document_type,
        fileUrl: document.file_url,
        uploadedAt: document.uploaded_at
    };

};

module.exports = documentDto;