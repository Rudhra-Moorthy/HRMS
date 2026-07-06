const pool = require('../../config/db');
const announcementRepo = require('./announcementRepository');
const announcementDto = require('./announcementDto');

/*
    Create Announcement
*/
const createAnnouncement = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const announcement = await announcementRepo.createAnnouncement(client, body);

        await client.query('COMMIT');

        return announcementDto(announcement);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

/*
    Get All Announcements
*/
const getAllAnnouncements = async () => {

    const announcements = await announcementRepo.getAllAnnouncements(pool);

    return announcements.map(announcementDto);

};

/*
    Get Announcement By Id
*/
const getAnnouncementById = async (id) => {

    const announcement = await announcementRepo.getAnnouncementById(pool, id);

    if (!announcement) {

        const err = new Error('Announcement not found');
        err.statusCode = 404;
        throw err;

    }

    return announcementDto(announcement);

};

/*
    Update Announcement
*/
const updateAnnouncement = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const existingAnnouncement =
            await announcementRepo.getAnnouncementById(client, id);

        if (!existingAnnouncement) {

            const err = new Error('Announcement not found');
            err.statusCode = 404;
            throw err;

        }

        const announcement =
            await announcementRepo.updateAnnouncement(client, id, body);

        await client.query('COMMIT');

        return announcementDto(announcement);

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

/*
    Soft Delete Announcement
*/
const deleteAnnouncement = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const announcement =
            await announcementRepo.getAnnouncementById(client, id);

        if (!announcement) {

            const err = new Error('Announcement not found');
            err.statusCode = 404;
            throw err;

        }

        const result = await announcementRepo.deleteAnnouncement(client, id);

        await client.query('COMMIT');

        return announcementDto(result);;

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();

    }

};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};