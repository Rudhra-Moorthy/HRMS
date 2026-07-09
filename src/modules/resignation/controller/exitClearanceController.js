const service = require('../service/exitClearanceService');

/* Get all exit clearances */
const getExitClearances = async (req, res) => {

    try {

        const clearances = await service.getExitClearances(req.query);

        return res.status(200).json({
            success: true,
            message: 'Exit clearances have been fetched successfully',
            ...clearances
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Get Exit clearance by id */
const getExitClearance = async (req, res) => {

    try {

        const clearance = await service.getExitClearance(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Exit clearance has been fetched successfully.',
            data: clearance
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Get My exit clearance */
const getMyExitClearance = async (req, res) => {

    try {

        const clearance = await service.getEmployeeClearance(req.user.employeeId);

        return res.status(200).json({
            success: true,
            message: 'Employee exit clearance has been fetched.',
            data: clearance
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get pending tasks */
const getPendingTasks = async (req, res) => {

    try {

        const pendingTasks = await service.getPendingTasks(req.user.employeeId);

        return res.status(200).json({
            success: true,
            message: "Employee's exit clearance pending tasks has been fetched.",
            data: pendingTasks
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get task */
const getTask = async () => {

    try {
        const task = await service.getTask(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Exit clearance task has been fetched.',
            data: task
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Approve Task */
const approveTask = async (req, res) => {

    try {

        const approved = await service.approveTask(req.params.taskId, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            message: "Task has been approved successfully.",
            data: approved
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

/* Reject Task */
const rejectTask = async (req, res) => {

    try {

        const rejected = await service.rejectTask(req.params.taskId, req.user.employeeId, req.body.remarks);

        return res.status(200).json({
            success: true,
            message: "Task has been rejected successfully.",
            data: rejected
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

/* Complete exit clearance */
const completeExitClearance = async (req, res) => {

    try {

        const completed = await service.completetExitClearance(req.params.clearanceId);

        return res.status(200).json({
            success: true,
            message: 'Exit clearance has been completed successfully.',
            data: completed
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

module.exports = {
    getExitClearances,
    getExitClearance,
    getMyExitClearance,
    getPendingTasks,
    getTask,
    approveTask,
    rejectTask,
    completeExitClearance
};