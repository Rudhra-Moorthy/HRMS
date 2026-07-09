const createAnnouncement = async (client, announcement) => {

    const query = `
        INSERT INTO announcements
        (
            title,
            category,
            target_audience,
            message,
            created_by
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING
            id,
            title,
            category,
            target_audience,
            message,
            created_by,
            created_at,
            updated_at;
    `;

    const values = [
        announcement.title,
        announcement.category,
        announcement.targetAudience,
        announcement.message,
        announcement.createdBy
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};

const getAllAnnouncements = async (pool) => {

    const query = `
        SELECT
            id,
            title,
            category,
            target_audience,
            message,
            created_by,
            created_at,
            updated_at
        FROM announcements
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

};

const getAnnouncementById = async (pool, id) => {

    const query = `
        SELECT
            id,
            title,
            category,
            target_audience,
            message,
            created_by,
            created_at,
            updated_at
        FROM announcements
        WHERE
            id=$1
            AND deleted_at IS NULL;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

const updateAnnouncement = async (client, id, announcement) => {

    const query = `
        UPDATE announcements
        SET
            title = COALESCE($1, title),
            category = COALESCE($2, category),
            target_audience = COALESCE($3, target_audience),
            message = COALESCE($4, message),
            updated_at = NOW()
        WHERE
            id = $5
            AND deleted_at IS NULL
        RETURNING
            id,
            title,
            category,
            target_audience,
            message,
            created_by,
            created_at,
            updated_at;
    `;

    const values = [
        announcement.title,
        announcement.category,
        announcement.targetAudience,
        announcement.message,
        id
    ];

    const result = await client.query(query, values);

    return result.rows[0];

};
const deleteAnnouncement = async (client, id) => {

    const query = `
        UPDATE announcements
        SET
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE
            id = $1
            AND deleted_at IS NULL
        RETURNING
            id,
            title,
            category,
            target_audience,
            message,
            created_by,
            created_at,
            updated_at;
    `;

    const result = await client.query(query, [id]);

    return result.rows[0];

};
module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};