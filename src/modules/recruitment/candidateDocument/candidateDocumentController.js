const documentService = require("./candidateDocumentService");

// Create Document
const createDocument = async (req, res) => {

    try {

        const {
            candidateId,
            documentType,
            fileUrl
        } = req.body;

        if (!candidateId || !documentType || !fileUrl) {

            return res.status(400).json({
                success: false,
                message: "Candidate ID, Document Type and File URL are required."
            });

        }

        const data = await documentService.createDocument(req.body);

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Get All Documents
const getAllDocuments = async (req, res) => {

    try {

        const data = await documentService.getAllDocuments();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Get Document By Id
const getDocumentById = async (req, res) => {

    try {

        const data = await documentService.getDocumentById(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Document not found."
            });

        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Get Documents By Candidate Id
const getDocumentsByCandidateId = async (req, res) => {

    try {

        const data = await documentService.getDocumentsByCandidateId(
            req.params.candidateId
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Update Document
const updateDocument = async (req, res) => {

    try {

        const data = await documentService.updateDocument(
            req.params.id,
            req.body
        );

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Document not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Document updated successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Delete Document
const deleteDocument = async (req, res) => {

    try {

        const data = await documentService.deleteDocument(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Document not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully."
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

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