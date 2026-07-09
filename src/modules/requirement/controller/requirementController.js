const requirementService = require("../service/requirementService");

// Create Requirement
const createRequirement = async (req, res) => {

    try {

        const {
            requirementCode,
            position,
            departmentId,
            vacancies,
            experienceRequired,
            jobDescription,
            priority
        } = req.body;

        if (
            !requirementCode ||
            !position ||
            !departmentId ||
            !vacancies ||
            !experienceRequired ||
            !jobDescription ||
            !priority
        ) {

            return res.status(400).json({
                success: false,
                message: "Requirement Code, Position, Department, Vacancies, Experience Required, Job Description and Priority are required."
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
            message: err.message || "Internal server error"
        });

    }

};


// Get All Requirements
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
            message: err.message || "Internal server error"
        });

    }

};


// Get Requirement By Id
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
            message: err.message || "Internal server error"
        });

    }

};


// Update Requirement
const updateRequirement = async (req, res) => {

    try {

        if (Object.keys(req.body).length === 0) {

            return res.status(400).json({
                success: false,
                message: "At least one field is required."
            });

        }

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
            message: err.message || "Internal server error"
        });

    }

};


// Delete Requirement
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
            message: err.message || "Internal server error"
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