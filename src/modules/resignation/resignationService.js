const pool = require('../../config/db');
const resignationRepo = require('./resignationRepo');
const resignationDto = require('./resignationDto');

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
    
    try {
        const resignations = await resignationRepo.getAllResignations(pool);
        return resignations.map(resignationDto);
    } catch (error) {
        throw error;
    } 
};

const getResignationById = async (id) => {

    try {
        const resignation = await resignationRepo.getResignationById(client, id);
        return resignationDto(resignation);
    } catch (error) {
        throw error;
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