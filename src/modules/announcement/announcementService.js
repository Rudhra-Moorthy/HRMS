const pool = require('../../config/db');
const service = require('./announcementRepository');
const announcementDto = require('./announcementDto');

const createAnnouncement = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await service.createAnnouncement(client, body);

        await client.query('COMMIT');

        return announcementDto(result);

    } catch (err) {

        await client.query('ROLLBACK');

        throw err;

    } finally {

        client.release();

    }

};

const getAllAnnouncements = async () => {

    try {

        const announcements = await service.getAllAnnouncements(pool);

        return announcements.map(announcementDto);

    } catch (err) {
        throw err;
    } 

};

const getAnnouncementById = async (id) => {

    try {
        const announcement = await service.getAnnouncementById(pool, id);
        return announcementDto(announcement);
    } catch (err) {
        throw err;
    } 

};

const updateAnnouncement = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await service.updateAnnouncement(client, id, body);

        await client.query('COMMIT');

        return announcementDto(result);

    } catch (err) {

        await client.query('ROLLBACK');

        throw err;

    } finally {

        client.release();

    }

};

const deleteAnnouncement = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await service.deleteAnnouncement(client, id);

        await client.query('COMMIT');

        return result;

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