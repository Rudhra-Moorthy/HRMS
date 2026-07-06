const announcementDto = (announcement) => {

    if (!announcement) return null;

    return {
        id: announcement.id,
        title: announcement.title,
        category: announcement.category,
        targetAudience: announcement.target_audience,
        message: announcement.message,
        createdBy: announcement.created_by,
        createdAt: announcement.created_at,
        updatedAt: announcement.updated_at
    };
};

module.exports = announcementDto;