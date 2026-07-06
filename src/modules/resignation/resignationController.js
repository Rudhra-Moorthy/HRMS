const service = require('./resignationService');

const createResignation = async (req, res) => {
    try {

        /* Employee id should come from JWT token */
        req.body.employeeId = req.user.employeeId;

        const {
            reasonId,
            resignationDate,
            lastWorkingDay,
            additionalDetails
        } = req.body

        if(!reasonId || !resignationDate || !lastWorkingDay || !additionalDetails) {
            return res.status(400).json({
                suucess: false,
                message: "Required fields are missing. Please enter required values"
            });
        }

        const resignation = await service.createResignation(req.body);;

        return res.status(201).json({
            success: true,
            message: "Resignation has been submitted successfully",
            data: resignation
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

/* Employee can view his own resignation */
const getMyResignation = async (req, res) => {

    try {
        const employeeId = req.user.employeeId;

        const resignation = await service.getEmployeeResignation(employeeId);

        return res.status(200).json({
            success: true,
            data: resignation
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get pending requests */
const getPendingResignations = async (req, res) => {

    try {

        const resignations = await service.getPendingResignations(req.user.employeeId);

        return res.status(200).json({
            success: true,
            message: 'Pending resignation requests have been fetched successfully.',
            data: resignations
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Approve Resignation */
const approveResignation = async (req, res) => {

    try {

        const approved = await service.approveResignation(req.params.id, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            message: 'Resignation has been approved successfully',
            data: approved
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Reject Resignation */
const rejectResignation = async (req, res) => {

    try {

        const rejected = await service.rejectResignation(req.params.id, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            message: 'Resignation has been rejected successfully',
            data: rejected
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Get all pending resignation requests */
const getHrPendingResignations = async (req, res) => {

    try {

        const pendingResignations = await service.getHrPendingResignations();

        return res.status(200).json({
            success: true,
            message: 'HR pending resignations requests have been fetched successfully.',
            data
        });

    } catch (err) {
        
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Hr Approve */
const hrApproveResignation = async (req, res) => {

    try {

        const data = await service.hrApproveResignation(req.params.id, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            messgae: 'Resignation has been approved by HR',
            data
        });

    } catch (err) {
        
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* HR Reject */
const hrRejectResignation = async (req, res) => {

    try {

        const data = await service.hrApproveResignation(req.params.id, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            message: 'Resignation has been rejected by HR.',
            data
        });

    } catch (err) {
        
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}



module.exports = {
    createResignation,
    getMyResignation,
    getPendingResignations,
    approveResignation,
    rejectResignation,
    getHrPendingResignations,
    hrApproveResignation,
};