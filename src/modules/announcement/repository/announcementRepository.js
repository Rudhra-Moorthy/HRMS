
const createAnnouncement = async (client,announcement) => {

    const query = `
        INSERT INTO announcements
        (
            title,
            category,
            target_audience,
            message,
            created_by
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *;
    `;

    const values = [
        announcement.title,
        announcement.category,
        announcement.target_audience,
        announcement.message,
        announcement.created_by
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getAllAnnouncements = async (client) => {

    const query = `
        SELECT *
        FROM announcements
        ORDER BY created_at DESC
    `;

    const result = await client.query(query);

    return result.rows;
};

const getAnnouncementById = async (client, id) => {

    const query = `
        SELECT *
        FROM announcements
        WHERE id=$1
    `;

    const result = await client.query(query,[id]);

    return result.rows[0];
};

const updateAnnouncement = async (client, id, announcement) => {

    const query = `
        UPDATE announcements
        SET
            title=$1,
            category=$2,
            target_audience=$3,
            message=$4,
            updated_at=NOW()
        WHERE id=$5
        RETURNING *;
    `;

    const values = [
        announcement.title,
        announcement.category,
        announcement.target_audience,
        announcement.message,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const deleteAnnouncement = async (client,id) => {

    const query = `
        DELETE FROM announcements
        WHERE id=$1
        RETURNING *;
    `;

    const result = await client.query(query,[id]);

    return result.rows[0];
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};