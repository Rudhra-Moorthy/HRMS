const announcementService = require('./announcementService');

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
            createdBy == null
        ) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        const result = await announcementService.createAnnouncement(req.body);

        return res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

const getAllAnnouncements = async (req, res) => {

    try {

        const result = await announcementService.getAllAnnouncements();

        return res.status(200).json({
            success: true,
            message: 'Announcements have been fetched successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

const getAnnouncementById = async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid announcement id'
            });
        }

        const result = await announcementService.getAnnouncementById(id);

        return res.status(200).json({
            success: true,
            message: 'Announcement has been fetched successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

const updateAnnouncement = async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid announcement id'
            });
        }

        const {
            title,
            category,
            targetAudience,
            message
        } = req.body;

        if (
            title === undefined &&
            category === undefined &&
            targetAudience === undefined &&
            message === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'At least one field is required for update'
            });
        }

        const result = await announcementService.updateAnnouncement(id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

const deleteAnnouncement = async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid announcement id'
            });
        }

        const result = await announcementService.deleteAnnouncement(id);

        return res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
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