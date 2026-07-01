const service = require('../service/attendanceRegularizationService');

/* Create Attendance Regularization */
const createRegularization = async (req, res) => {

    try {

        const result = await service.createRegularization(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: "Attendance regularization has been submitted successfully.",
            data: result
        });

    } catch(err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }

}

/* Get Attendance Regularizations */
const getRegularizations = async (req, res) => {

    try {

        const result = await service.getRegularizations(req.query);

        return res.status(200).json({
            success: true,
            message: "Attendance Regularizations have been retrieved successfully.",
            data: result
        });

    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }

}

/* Get Attendance Regularization */
const getRegularization = async (req, res) => {

    try {

        const result = await service.getRegularization(req.params.id, req.query);

        return res.status(200).json({
            success: true,
            message: "Attendance Regularization has been retrieved successfully.",
            data: result
        });

    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }

}

/* Update Attendance Regularization */
const updateRegularization = async (req, res) => {

    try {

        const result = await service.updateRegularization(req.params.id, req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Attendance Regularization has been updated successfully."
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Approve Request -> patch */
const approveRegularization = async (req, res) => {

    try {

        const approved = await service.approveRegularization(req.params.id, req.user.employeeId);

        return res.status(200).json({
            success: true,
            message: 'Attendance regularization has been approved successfully.',
            data: approved
        });

    } catch (err) {

        return req.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Reject Request -> patch */
const rejectRegularization = async (req, res) => {

    try {

        const rejected = await service.rejectRegularization(req.params.id, req.user.employeeId, req.body.reason);

        return res.status().json({
            success: true,
            message: 'Attendance regularization has been rejected successfully.',
            data: rejected
        });
        
    } catch (err) {

        return req.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

module.exports = {
    createRegularization,
    getRegularizations,
    getRegularization,
    updateRegularization,
    approveRegularization,
    rejectRegularization
};