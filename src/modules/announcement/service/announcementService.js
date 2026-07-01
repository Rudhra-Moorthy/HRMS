const pool = require('../../../config/db');
const announcementRepo = require('../repository/announcementRepo');
const announcementDto = require('../dto/announcementDto');

const createAnnouncement = async (body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await announcementRepo.createAnnouncement(client, body);

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

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const announcements = await announcementRepo.getAllAnnouncements(client);

        await client.query('COMMIT');

        return announcements.map(announcementDto);

    } catch (err) {

        await client.query('ROLLBACK');

        throw err;

    } finally {

        client.release();

    }

};

const getAnnouncementById = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const announcement = await announcementRepo.getAnnouncementById(client, id);

        await client.query('COMMIT');

        return announcementDto(announcement);

    } catch (err) {

        await client.query('ROLLBACK');

        throw err;

    } finally {

        client.release();

    }

};

const updateAnnouncement = async (id, body) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const result = await announcementRepo.updateAnnouncement(client, id, body);

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

        const result = await announcementRepo.deleteAnnouncement(client, id);

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