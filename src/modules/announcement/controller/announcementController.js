const announcementService = require('../service/announcementService');

const createAnnouncement = async (req, res) => {
    try {

        const {
            title,
            category,
            targetAudience,
            message,
            createdBy
        } = req.body;

        if (
            !title ||
            !category ||
            !targetAudience ||
            !message ||
            !createdBy
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        const data = await announcementService.createAnnouncement(req.body);

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getAllAnnouncements = async (req, res) => {
    try {

        const data = await announcementService.getAllAnnouncements();

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

const getAnnouncementById = async (req, res) => {
    try {

        const data = await announcementService.getAnnouncementById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
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

const updateAnnouncement = async (req, res) => {
    try {

        const data = await announcementService.updateAnnouncement(
            req.params.id,
            req.body
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const deleteAnnouncement = async (req, res) => {
    try {

        const data = await announcementService.deleteAnnouncement(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};