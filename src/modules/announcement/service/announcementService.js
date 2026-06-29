const announcementRepo = require('../repository/announcementRepo');
const announcementDto = require('../dto/announcementDto');

const createAnnouncement = async (body) => {

    const result = await announcementRepo.createAnnouncement(body);

    return announcementDto(result);
};

const getAllAnnouncements = async () => {

    const announcements = await announcementRepo.getAllAnnouncements();

    return announcements.map(announcementDto);
};

const getAnnouncementById = async (id) => {

    const announcement = await announcementRepo.getAnnouncementById(id);

    return announcementDto(announcement);
};

const updateAnnouncement = async (id, body) => {

    const result = await announcementRepo.updateAnnouncement(id, body);

    return announcementDto(result);
};

const deleteAnnouncement = async (id) => {

    return await announcementRepo.deleteAnnouncement(id);
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};