const pool = require('../../../config/db');
const repo = require('../repository/resignationRepo');
const resignationDto = require('../dto/resignationDto');
const RESIGNATION_STATUS = require('../../../constants/resignationStatus');

const createResignation = async (dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Employee exists ? */
        const employee = await repo.getEmployee(client, dto.employeeId);
        if(!employee) {
            const err = new Error('Employee has not found');
            err.statusCode = 404;
            throw err;
        }

        /* Active Employee ? */
        if(employee.status !== 'Active') {
            const err = new Error('Employee is Inactive');
            err.statusCode = 400;
            throw err;
        }

        /* Pending resignation ? */
        const pending = await repo.getPendingResignation(client, dto.employeeId);
        if(pending) {
            const err = new Error('Pending resignation already exists.');
            err.statusCode = 409;
            throw err;
        }

        /* Validate Reason */
        const reason = await repo.getReason(client, dto.reasonId);
        if(!reason) {
            const err = new Error('Invalid resignation reason');
            err.statusCode = 400;
            throw err;
        }

        /* Reporting Manager */
        const manager = await repo.getReportingManager(client, dto.employeeId);
        if(!manager) {
            const err = new Error('Reporting manager has not configured');
            err.statusCode = 400;
            throw err;
        }

        dto.reportingManagerId = manager.manager_id;

        /* Calculate Notie period */
        const resignationDate = new Date(dto.resignationDate);
        const lastWorkingDay = new Date(dto.lastWorkingDay);

        const diff = Math.ceil((lastWorkingDay - resignationDate) / (1000 * 60 * 60 * 24));
        if(diff < 0) {
            const err = new Error('Last Working day cannot be before resignation date');
            err.statusCode = 400;
            throw err;
        }
        dto.noticePeriodDays = diff;
        
        /* Save Resignation */
        const resignation = await repo.createResignation(client, dto);

        /* Log History */
        await repo.logHistory(client, resignation.id, 'SUBMITTED', dto.employeeId, null, RESIGNATION_STATUS.PENDING, 'Resignation has beeb submitted by employee');
        
        await client.query('COMMIT');

        return resignationDto(resignation);
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/* Get Employee resignation by EmployeeId */
const getEmployeeResignation = async (employeeId) => {

    const resignation = await repo.getEmployeeResignation(pool, employeeId);

    if(!resignation) {
        const err = new Error('Resignation record has not found for given employeeId');
        err.statusCode = 404;
        throw err;
    }

    return resignationDto(resignation);

}

/* Get Pending requests */
const getPendingResignations = async (managerId) => {
    return await repo.getPendingResignations(pool, managerId);
}

/* Approve */
const approveResignation = async (resignationId, managerId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check resignation exists ? */
        const resignation = await repo.getResignation(client, resignationId);
        if(!resignation) {
            const err = new Error('Resignation has not found');
            err.statusCode = 404;
            throw err;
        }

        /* Reporting manager id should be same either deny the access */
        if(resignation.reporting_manager_id != managerId) {
            const err = new Error('Reporting manager is different to a reisgntaion that you want to approve');
            err.statusCode = 403;
            throw err;
        }

        /* Check before that the resignation is already processed ? */
        if(resignation.status !== RESIGNATION_STATUS.PENDING) {
            const err = new Error('Already processed');
            err.statusCode = 409;
            throw err;
        }

        /* Approve the resignation */
        const approved = repo.approveResignation(client, resignationId, managerId);

        /* Log the history */
        await repo.logHistory(client, resignationId, 'MANAGER_APPROVED', managerId, RESIGNATION_STATUS.PENDING, RESIGNATION_STATUS.MANAGER_APPROVED, remarks);

        await client.query('COMMIT');

        return approved;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }finally {
        client.release();
    }
}

/* Reject Resignation */
const rejectResignation = async (resignationId, managerId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check resignation exists ? */
        const resignation = await repo.getResignation(client, resignationId);
        if(!resignation) {
            const err = new Error('Resignation has not found');
            err.statusCode = 404;
            throw err;
        }

        /* Reporting manager id should be same either deny the access */
        if(resignation.reporting_manager_id != managerId) {
            const err = new Error('Reporting manager is different to a reisgntaion that you want to approve');
            err.statusCode = 403;
            throw err;
        }

        /* Check before that the resignation is already processed ? */
        if(resignation.status !== 'PENDING') {
            const err = new Error('Already processed');
            err.statusCode = 409;
            throw err;
        }

        /* Reject the resignation */
        const rejected = await repo.rejectResignation(client, resignationId, managerId);

        /* Log History */
        await repo.logHistory(client, resignationId, 'MANAGER_REJECTED', managerId, RESIGNATION_STATUS.PENDING, RESIGNATION_STATUS.MANAGER_REJECTED, remarks);

        await client.query('COMMIT');

        return rejected;


    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    }finally {
        client.release();
    }
}

/* Get HR pending requests */
const getHrPendingResignations = async () => {
    return await repo.getHrPendingResignations(pool);
}

/* HR Approve */
const hrApproveResignation = async (resignationId, hrId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check Resignation exists ? */
        const resignation = await repo.getResignation(client, resignationId);
        if(!resignation) {
            const err = new Error('Resignation has not found');
            err.statusCode = 404;
            throw err;
        }

        /* Check the status that should be Manager Approved */
        if(resignation.status !== RESIGNATION_STATUS.MANAGER_APPROVED) {
            const err = new Error('Manager approval is required');
            err.statusCode = 409;
            throw err;
        }

        /* Approve the resignation */
        const approved = await repo.hrApproveResignation(client, resignationId);

        /* After hr approval create exit clearance */
        approved.hr_approved_by = hrId;
        const clearance = await repo.createExitClearance(client, approved);

        /* Create exit clearance tasks */
        await repo.createExitClearanceTasks(client, clearance.id, approved.employee_id);

        /* Generate employee asset clearance */
        await repo.createExitClearanceAssets(client, clearance.id, approved.employee_id);

        /* Log History */
        await repo.logHistory(client, resignationId, 'HR_APPROVED', hrId, RESIGNATION_STATUS.MANAGER_APPROVED, RESIGNATION_STATUS.HR_APPROVED, remarks);

        await client.query('COMMIT');

        return approved;

    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* HR Reject */
const hrRejectResignation = async (resignationId, hrId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check already exists ? */
        const resignation = await repo.getResignation(client, resignationId);
        if(!resignation) {
            const err = new Error('Resignation has not found.');
            err.statusCode = 404;
            throw err;
        }

        /* Check the status that should be Manager Approved */
        if(resignation.status !== RESIGNATION_STATUS.MANAGER_APPROVED) {
            const err = new Error('Manager approval is required.');
            err.statusCode = 409;
            throw err;
        }

        /* Reject resignation */
        const rejected = await repo.hrRejectResignation(client, resignationId);

        /* Log history */
        await repo.logHistory(client, resignationId, 'HR_REJECTED', hrId, RESIGNATION_STATUS.MANAGER_APPROVED, RESIGNATION_STATUS.HR_REJECTED, remarks);

        await client.query('COMMIT');

        return rejected;

    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    createResignation,
    getEmployeeResignation,
    approveResignation,
    rejectResignation,
    getHrPendingResignations,
    hrApproveResignation,
    hrRejectResignation,
};