const pool = require('../../../config/db');
const resignationRepo = require('../repository/resignationRepo');
const resignationDto = require('../ dto/resignationDto');

const createResignation = async (body) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await resignationRepo.createResignation(client, body);
        await client.query('COMMIT');
        return resignationDto(result);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getAllResignations = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resignations = await resignationRepo.getAllResignations(client);
        await client.query('COMMIT');
        return resignations.map(resignationDto);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getResignationById = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resignation = await resignationRepo.getResignationById(client, id);
        await client.query('COMMIT');
        return resignationDto(resignation);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateResignation = async (id, body) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await resignationRepo.updateResignation(client, id, body);
        await client.query('COMMIT');
        return resignationDto(result);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteResignation = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await resignationRepo.deleteResignation(client, id);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createResignation,
    getAllResignations,
    getResignationById,
    updateResignation,
    deleteResignation
};