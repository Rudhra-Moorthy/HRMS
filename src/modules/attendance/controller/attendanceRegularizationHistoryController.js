const service = require('../service/attendanceRegularizationHistoryService');

/* Create History */
const createHistory = async (req, res) => {

    try {

        const result = await service.createHistory(req.body);

        return res.status(201).json({
            success: true,
            message: "History has been created successfully.",
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get history by regularization */
const getHistory = async (req, res) => {

    try {
        const result = await service.getHistory(req.params.regularizationId);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

module.exports = {
    createHistory, 
    getHistory,
}