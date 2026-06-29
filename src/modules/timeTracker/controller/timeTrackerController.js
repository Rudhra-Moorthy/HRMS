const timeTrackerService = require('../service/timeTrackerService');

const createTimeEntry = async (req, res) => {

    try {

        const {
            employee_id,
            project_name,
            task_name,
            start_time
        } = req.body;

        if (
            !employee_id ||
            !project_name ||
            !task_name ||
            !start_time
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });

        }

        const data = await timeTrackerService.createTimeEntry(req.body);

        return res.status(201).json({
            success: true,
            message: "Time entry created successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getAllTimeEntries = async (req, res) => {

    try {

        const data = await timeTrackerService.getAllTimeEntries();

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

const getTimeEntryById = async (req, res) => {

    try {

        const data = await timeTrackerService.getTimeEntryById(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Time entry not found"
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

const updateTimeEntry = async (req, res) => {

    try {

        const data = await timeTrackerService.updateTimeEntry(
            req.params.id,
            req.body
        );

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Time entry not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Time entry updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const deleteTimeEntry = async (req, res) => {

    try {

        const data = await timeTrackerService.deleteTimeEntry(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Time entry not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Time entry deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getTimesheet = async (req, res) => {

    try {

        const data = await timeTrackerService.getTimesheet(
            req.params.employeeId
        );

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

module.exports = {
    createTimeEntry,
    getAllTimeEntries,
    getTimeEntryById,
    updateTimeEntry,
    deleteTimeEntry,
    getTimesheet
};
