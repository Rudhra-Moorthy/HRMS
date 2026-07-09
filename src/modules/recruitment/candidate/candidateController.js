const candidateService = require("./candidateService");

// Create Candidate
const createCandidate = async (req, res) => {

    try {

        const {
            requirementId,
            fullName,
            email,
            phoneNumber
        } = req.body;

        if (!requirementId || !fullName || !email || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Requirement ID, Full Name, Email, and Phone Number are required."
            });
        }

        const data = await candidateService.createCandidate(req.body);

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Get All Candidates
const getAllCandidates = async (req, res) => {

    try {

        const data = await candidateService.getAllCandidates();

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

// Get Candidate By Id
const getCandidateById = async (req, res) => {

    try {

        const data = await candidateService.getCandidateById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
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

// Update Candidate
const updateCandidate = async (req, res) => {

    try {

        const data = await candidateService.updateCandidate(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

// Delete Candidate
const deleteCandidate = async (req, res) => {

    try {

        const data = await candidateService.deleteCandidate(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully."
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });

    }

};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};