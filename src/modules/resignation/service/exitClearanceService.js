const pool = require('../../../config/db');
const repo = require('../repository/exitClearanceRepo');
const dto = require('../dto/exitClearanceDto');

/* Get all exit clearances */
const getExitClearances = async (filters) => {

    const clearances = await repo.getExitClearances(pool, filters);
    const total = await repo.getExitClearanceCount(pool, filters);

    return {
        total,
        page: Number(filters.page || 1),
        limit: Number(filters.limit || 10),
        data: clearances.map(dto)
    };

}

/* Get Exit clearance */
const getExitClearance = async (id) => {
    
    const clearance = await repo.getExitClearance(pool, id);
    if(!clearance) {
        const err = new Error('Exit clearance has not found.');
        err.statusCode = 404;
        throw err;
    }

    const tasks = await repo.getExitClearanceTasks(pool, id);
    const assets = await repo.getExitClearanceAssets(pool, id);

    return {
        ...dto(clearance),
        tasks,
        assets
    };

}

/* Get employee clearance */
const getEmployeeClearance = async (employeeId) => {

    const clearance = await repo.getEmployeeExitClearance(pool, employeeId);
    if(!clearance) {
        const err = new Error('Exit clearance has not found.');
        err.statusCode = 404;
        throw err;
    }

    return dto(clearance);

}

/* Get Pending Tasks */
const getPendingTasks = async (employeeId) => {

    const pendingTasks = await repo.getPendingTasks(pool, employeeId);
    if(pendingTasks.length === 0) {
        const err = new Error('No pending tasks for the employee');
        err.statusCode(409);
        throw err;
    }

    return pendingTasks;

}

/* Get task */
const getTask = async (taskId) => {

    const task = await repo.getTask(pool, taskId);
    if(!task) {
        const err = new Error('Task has not found.');
        err.statusCode = 404;
        throw err;
    }

    return task;

}

/* Approve task */
const approveTask = async (taskId, approveId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const task = await repo.getTask(client, taskId);
        if(!task) {
            const err = new Error('Task has not found.');
            err.statusCode = 404;
            throw err;
        }

        if(task.assigned_to != approveId) {
            const err = new Error('Unauthorized');
            err.statusCode = 403;
            throw err;
        }

        if(task.status !== 'PENDING') {
            const err = new Error('Task had already been processed');
            err.statusCode = 409;
            throw err;
        }

        /* Approve the task */
        const approved = await repo.approveTask(client, taskId, approveId, remarks);

        /* log history */
        await repo.logHistory(client, task.clearance_id, task.id, 'TASK_APPROVED', approveId, 'PENDING', 'APPROVED', remarks);

        /* Check pending tasks */
        const pendingTasks = await repo.checkPendingTasks(client, task.clearance_id);
        if(pendingTasks === 0) {
            const pendingAssets = await repo.checkPendingAssets(client, task.clearance_id);
            if(pendingAssets === 0) {
                await repo.completeExitClearance(client, task.clearance_id);
            }
        }

        await client.query('COMMIT');

        return approved;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}

/* Reject Task */
const rejectTask = async (taskId, approverId, remarks) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const task = await repo.getTask(client, taskId);
        if(!task) {
            const err = new Error('Task has not found.');
            err.statusCode = 404;
            throw err;
        }

        if(task.assigned_to != approveId) {
            const err = new Error('Unauthorized');
            err.statusCode = 403;
            throw err;
        }

        if(task.status !== 'PENDING') {
            const err = new Error('Task had already been processed');
            err.statusCode = 409;
            throw err;
        }

        /* Reject the task */
        const rejected = await repo.rejectTask(client, taskId, approverId, remarks);

        /* Log the history */
        await repo.logHistory(client, task.clearance_id, task.id, 'TASK_REJECTED', approverId, 'PENDING', 'REJECTED', remarks);

        await client.query('COMMIT');

        return rejected

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* Complete Exit clearance */
const completetExitClearance = async (clearanceId) => {
    
    const client = await pool.connect();

    try {
        
        await client.query('BEGIN');

        /* Check clearance exists */
        const clearance = await repo.getExitClearance(client, clearanceId);
        if(!clearance) {
            const err = new Error('Exit clearance has not found');
            err.statusCode = 404;
            throw err;
        }

        /* Already completed ? */
        if(clearance.overall_status === 'COMPLETED') {
            const err = new Error('Exit clearance already completed.');
            err.statusCode = 409;
            throw err;
        }

        /* Pendinf tasks */
        const pendingTasks = await repo.checkPendingTasks(client, clearanceId);
        if(pendingTasks > 0) {
            const err = new Error('Pending department tasks exists.');
            err.statusCode = 409;
            throw err;
        }

        /* Pending assets */
        const pendingAssets = await repo.checkPendingAssets(client, clearanceId);
        if(pendingAssets > 0) {
            const err = new Error('Company assets are not returned.');
            err.statusCode = 409;
            throw err;
        }

        /* Complete exit clearance */
        const completed = await repo.completeExitClearance(client, clearanceId);

        /* Log history */
        await repo.logHistory(client, clearanceId, null, 'EXIT_CLEARANCE_COMPLETED', null, 'APPROVED', 'COMPLETED','Exit clearance completed');

        await client.query('COMMIT');

        return completed;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}

module.exports = {
    getExitClearances,
    getExitClearance,
    getPendingTasks,
    getEmployeeClearance,
    getTask,
    approveTask,
    rejectTask,
    completetExitClearance,
}