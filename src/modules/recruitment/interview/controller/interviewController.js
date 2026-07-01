const interviewService = require('../service/interviewService');

const createInterview = async (req, res) => {

    try {

        const data = await interviewService.createInterview(req.body);

        return res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


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
            message: err.message
        });

    }

};


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
            message: err.message
        });

    }

};


const updateInterview = async (req, res) => {

    try {

        const data = await interviewService.updateInterview(req.params.id, req.body);

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
            message: err.message
        });

    }

};


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
            message: err.message
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