const timeTrackerService = require('./timeTrackerService');

// Create Time Entry
const createTimeEntry = async (req, res) => {

    try {

        const {
            employeeId,
            projectName,
            taskName,
            startTime
        } = req.body;

        if (
            !employeeId ||
            !projectName ||
            !taskName ||
            !startTime
        ) {

            return res.status(400).json({
                success: false,
                message: "Employee ID, Project Name, Task Name and Start Time are required."
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
            message: err.message || "Internal server error"
        });

    }

};

// Get All Time Entries
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
            message: err.message || "Internal server error"
        });

    }

};

// Get Time Entry By Id
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
            message: err.message || "Internal server error"
        });

    }

};

// Update Time Entry
const updateTimeEntry = async (req, res) => {

    try {

        if (Object.keys(req.body).length === 0) {

            return res.status(400).json({
                success: false,
                message: "At least one field is required."
            });

        }

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
            message: err.message || "Internal server error"
        });

    }

};

// Delete Time Entry
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
            message: err.message || "Internal server error"
        });

    }

};

// Get Employee Timesheet
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
            message: err.message || "Internal server error"
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