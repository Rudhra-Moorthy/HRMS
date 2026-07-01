const pool = require('../../../config/db');
const repo = require('../repository/attendanceRegularizationHistoryRepo');

/* Create History */
const createHistory = async (dto) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const history = await repo.createHistory(client, dto);

        await client.query('COMMIT');

        return history;

    } catch (err) {
        await client.query('ROLLBACK');
        return err;
    } finally {
        client.release();
    }
}

/* Get History */
const getHistory = async (regularizationId) => {

    return await repo.getHistory(pool, regularizationId);

}

module.exports = {
    createHistory,
    getHistory
}
