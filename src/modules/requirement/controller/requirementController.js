const requirementService = require('../service/requirementService');

const createRequirement = async (req, res) => {
    try {

        const {
            requirement_code,
            position,
            dept_id,
            vacancies,
            experience_required,
            job_description,
            priority,
            status
        } = req.body;

        if (
            !requirement_code ||
            !position ||
            !dept_id ||
            !vacancies ||
            !experience_required ||
            !job_description ||
            !priority ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        const data = await requirementService.createRequirement(req.body);

        return res.status(201).json({
            success: true,
            message: "Requirement created successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getAllRequirements = async (req, res) => {
    try {

        const data = await requirementService.getAllRequirements();

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

const getRequirementById = async (req, res) => {
    try {

        const data = await requirementService.getRequirementById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found"
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

const updateRequirement = async (req, res) => {
    try {

        const data = await requirementService.updateRequirement(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requirement updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const deleteRequirement = async (req, res) => {
    try {

        const data = await requirementService.deleteRequirement(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requirement deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    createRequirement,
    getAllRequirements,
    getRequirementById,
    updateRequirement,
    deleteRequirement
};