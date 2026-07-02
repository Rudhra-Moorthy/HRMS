const pool = require('../../../config/db');
const repo = require('../repository/attendanceRegularizationRepo');
const historyRepo = require('../repository/attendanceRegularizationHistoryRepo');

const createRegularization = async (employeeId, dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Attendance Exists ? */
        const attendance = await repo.getAttendance(client, dto.attendanceId);
        if(!attendance) {
            const err = new Error('Attendance record not found.');
            err.statusCode = 404;
            throw err;
        }

        /* Employee owns attendance ? */
        if(attendance.employee_id !== employeeId) {
            const err = new Error('You are not allowed to regularize this attendance.');
            err.statusCode = 403;
            throw err;
        }

        /* Already pending ? */
        const pending = await repo.getPendingRegulaization(client, dto.attendanceId);
        if(pending) {
            const err = new Error('Attendance regularization request is already pending.');
            err.statusCode = 409;
            throw err;
        }

        /* Attendance already approved ? */
        if(attendance.attendance_status === 'LEAVE' || attendance.attendance_status === 'HOLIDAY') {
            const err = new Error('Attendance regularization request cannot be regularized.');
            err.statusCode = 400;
            throw err;
        }

        const regularization = await repo.createRegularization(client, employeeId, dto);

        /* Log History */
        await historyRepo.logHistory(
            client, 
            regularization.regularization_id, 
            employeeId, 
            'SUBMITTED', 
            employeeId, 
            dto.reason, 
            null, 
            'PENDING'
        );

        await client.query('COMMIT');

        return regularization;
 
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}

/* Get all regulairzations */
const getRegularizations = async (filters) => {
    return repo.getRegularizations(pool, filters);
}

/* Get one regularization */
const getRegularization = async (id, filters) =>  {

    const regularization = await repo.getRegularization(pool, id, filters);

    if(!regularization) {
        const err = new Error('Attendance regularization record is not found.');
        err.statusCode = 404;
        throw err;
    }

    return regularization;

}

/* Update Regularization */
const updateRegularization = async (id, employeeId, dto) => {
    
    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const regularization = await repo.getRegularization(client, id);
        if(!regularization) {
            const err = new Error('Attendance regularization request has not been found.');
            err.statusCode = 404;
            throw err;
        }

        if(regularization.employee_id !== employeeId) {
            const err = new Error('You cannot update this request');
            err.statusCode = 403;
            throw err;
        }

        if(regularization.attendance_status !== 'PENDING') {
            const err = new Error('Only pending requests can be updated.');
            err.statusCode = 409;
            throw err;
        }

        const updated = await repo.updateRegularization(client, id, dto);

        /* Log History */
        await historyRepo.logHistory(
            client, 
            id, 
            employeeId, 
            'UPDATED', 
            employeeId, 
            dto.reason, 
            'PENDING', 
            'PENDING'
        );

        await client.query('COMMIT');

        return updated;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}

/* Approve Regularization */
const approveRegularization = async (regularizationId, managerId) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check regularization request */
        const regularization = await repo.getRegularization(client, regularizationId);
        if(!regularization) {
            const err = new Error('Attendance regularization request has not been found.');
            err.statusCode = 404;
            throw err;
        }

        /* Already processed ? */
        if(regularization.status !== 'PENDING') {
            const err = new Error('Regularization reuest has already been processed.');
            err.statusCode = 409;
            throw err;
        }

        /* Verify Reporting Manager */
        const manager = await repo.getReportingManager(client, regularization.employee_id);
        if(!manager || manager.manager_id !== managerId) {
            const err = new Error('You are not authorized to approve this request.');
            err.statusCode = 403;
            throw err;
        }

        /* Approve Request */
        const approved = await repo.approveRegularization(client, regularizationId, managerId);

        /* Update attendance */
        let attendance = await repo.updateAttendanceAfterApproval(client, approved);

        /* Recalculate Attendance */
        attendance = await repo.recalculateAttendance(client, attendance.id);

        /* Log History */
        await historyRepo.logHistory(
            client, 
            regularizationId,
            regularization.employee_id,
            'APPROVED',
            managerId,
            'Attendance regularization has been approved',
            'PENDING',
            'APPROVED'
        );

        await client.query('COMMIT');

        return attendance;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* Reject regularization */
const rejectRegularization = async (regularizationId, managerId, rejectedReason) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const regularization = await repo.getRegularization(client, regularizationId);
        if(!regularization) {
            const err = new Error('Attendance regularization request has not been found.');
            err.statusCode = 404;
            throw err;
        }

        /* Already processed ? */
        if(regularization.status !== 'PENDING') {
            const err = new Error('Regularization request has already been processed.');
            err.statusCode = 409;
            throw err;
        }

        /* Verify Reporting Manager */
        const manager = await repo.getReportingManager(client, regularization.employee_id);
        if(!manager || manager.manager_id !== managerId) {
            const err = new Error('You are not authorized to reject this request.');
            err.statusCode = 403;
            throw err;
        }

        const rejected = await repo.rejectRegularization(client, regularizationId, managerId, rejectedReason);

        /* Log History */
        await historyRepo.logHistory(
            client, 
            regularizationId, 
            regularization.employee_id,
            'REJECTED',
            managerId,
            rejectedReason,
            'PENDING',
            'REJECTED'
        );

        await client.query('COMMIT');

        return rejected;


    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}

module.exports = {
    createRegularization,
    getRegularizations,
    getRegularization,
    updateRegularization,
    approveRegularization,
    rejectRegularization,
}