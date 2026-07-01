const resignationService = require('../service/resignationService');

const createResignation = async (req, res) => {
    try {

        const {
            employee_id,
            resignation_date,
            last_working_day,
            reason
        } = req.body;

        if (
            !employee_id ||
            !resignation_date ||
            !last_working_day ||
            !reason
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        const data = await resignationService.createResignation(req.body);

        return res.status(201).json({
            success: true,
            message: "Resignation submitted successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getAllResignations = async (req, res) => {
    try {

        const data = await resignationService.getAllResignations();

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

const getResignationById = async (req, res) => {
    try {

        const data = await resignationService.getResignationById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Resignation not found"
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

const updateResignation = async (req, res) => {
    try {

        const data = await resignationService.updateResignation(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Resignation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resignation updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const deleteResignation = async (req, res) => {
    try {

        const data = await resignationService.deleteResignation(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Resignation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resignation deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    createResignation,
    getAllResignations,
    getResignationById,
    updateResignation,
    deleteResignation
};