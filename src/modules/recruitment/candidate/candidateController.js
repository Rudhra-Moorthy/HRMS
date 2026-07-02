const candidateService = require('./candidateService');

const createCandidate = async (req, res) => {

    try {

        const {
            requirementId,
            fullName,
            email,
            phoneNumber
        } = req.body;

        if (
            !requirementId ||
            !fullName ||
            !email ||
            !phoneNumber
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });

        }

        const data = await candidateService.createCandidate(req.body);

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

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
            message: err.message
        });

    }

};

const getCandidateById = async (req, res) => {

    try {

        const data = await candidateService.getCandidateById(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });

        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const updateCandidate = async (req, res) => {

    try {

        const data = await candidateService.updateCandidate(
            req.params.id,
            req.body
        );

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const deleteCandidate = async (req, res) => {

    try {

        const data = await candidateService.deleteCandidate(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
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