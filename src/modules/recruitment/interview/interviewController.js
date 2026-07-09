const interviewService = require("./interviewService");

// Create Interview
const createInterview = async (req, res) => {

    try {

        const {
            candidateId,
            interviewerId,
            interviewType,
            interviewDate,
            startTime
        } = req.body;

        if (
            !candidateId ||
            !interviewerId ||
            !interviewType ||
            !interviewDate ||
            !startTime
        ) {

            return res.status(400).json({
                success: false,
                message: "Candidate, Interviewer, Interview Type, Interview Date and Start Time are required."
            });

        }

        const data = await interviewService.createInterview(req.body);

        return res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });

    }

};


// Get All Interviews
const getAllInterviews = async (req, res) => {

    try {

        const data = await interviewService.getAllInterviews();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });

    }

};


// Get Interview By Id
const getInterviewById = async (req, res) => {

    try {

        const data = await interviewService.getInterviewById(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });

        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });

    }

};


// Update Interview
const updateInterview = async (req, res) => {

    try {

        const data = await interviewService.updateInterview(
            req.params.id,
            req.body
        );

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Interview updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });

    }

};


// Delete Interview
const deleteInterview = async (req, res) => {

    try {

        const data = await interviewService.deleteInterview(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Interview deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });

    }

};


module.exports = {
    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};