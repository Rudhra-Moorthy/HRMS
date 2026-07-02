const pool = require('../../../config/db');

const attendanceRepo = require('../repository/attendanceRepo');
const employeeService = require('../../employee/service/employeeService');

/* Create Attendance */
const createAttendance = async (dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Check Whether employee is exists or not exists*/
        const employee = await employeeService.getEmployee(dto.employeeId);
        if(!employee) {
            const err = new Error('Employee not found');
            err.statusCode = 404;
            throw err;
        }

        /* Already Marked ? */
        const existing = await attendanceRepo.getAttendanceByEmployeeAndDate(client, dto.employeeId, dto.attendanceDate);
        if(existing) {
            const err = new Error('Attendance already exists');
            err.statusCode = 409;
            throw err;
        }

        /* Get active shifts */
        const shift = await attendanceRepo.getEmployeeShift(client, dto.employeeId);
        if(!shift) {
            throw new Error('Shift is not assigned');
        }

        /* Get Attendance Policy */
        const policy = await attendanceRepo.getAttendancePolicy(client, dto.employeeId);
        if(!policy) {
            throw new Error("Attendance policy is missing");
        }

        /* Calculate Status */
        const attendanceStatus = 'PRESENT';
        const attendance = await attendanceRepo.createAttendance(client, dto, shift, policy, attendanceStatus);

        await client.query('COMMIT');

        return attendance;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* Get all attendances */
const getAttendances = async(filters) => {
    return attendanceRepo.getAttendances(filters);
}

/* Check In operation */
const checkIn = async (dto) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /* Employee */
        const employee = await attendanceRepo.getEmployee(client, dto.employeeId);
        if(!employee) {
            const err =  new Error("Employee Not Found");
            err.statusCode = 404;
            throw err;
        }

        /* Leave */
        const leave = await attendanceRepo.hasApprovedLeave(client, dto.employeeId, dto.attendanceDate);
        if(leave) {
            const err = new Error("Employee is on leave");
            err.statusCode = 409;
            throw err;
        }

        /* Holiday */
        const holiday = await attendanceRepo.isHoliday(client, dto.attendanceDate);
        if(holiday) {
            const err = new Error('Today is Holiday');
            err.statusCode = 409;
            throw err;
        }

        /* Already checked in */
        const attendance = await attendanceRepo.getAttendanceByEmployeeAndDate(client, dto.employeeId, dto.attendanceDate);
        if(attendance) {
            const err = new Error('Already Checked In');
            err.statusCode = 409;
            throw err;
        }

        /* Shift */
        const shift = await attendanceRepo.getEmployeeShift(client, dto.employeeId);
        if(!shift) {
            const err = new Error('Shift is not assigned');
            err.statusCode = 409;
            throw err;
        }

        /* Attendance Policy */
        const policy = await attendanceRepo.getAttendancePolicy(client, dto.employeeId);
        if(!policy) {
            const err = new Error('Attendance Policy is missing');
            err.statusCode = 409;
            throw err;
        }

        /* Late Minutes */
        const lateMinutes = calculateLateMinutes(dto.checkInTime, shift.start_time, policy.grace_period_minutes);

        const result = await attendanceRepo.chechIn(client, dto, shift.shift_id, policy.policy_id, lateMinutes);

        await client.query('COMMIT');

        return result;

    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* Check Out */
const checkOut = async (employeeId) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const attendance = await attendanceRepo.getTodayAttendance(client, employeeId);
        if(!attendance) {
            const err = new Error('Check-In is not found');
            err.statusCode = 404;
            throw err;
        }

        if(attendance.check_out_time) {
            const err = new Error('Already checked-out');
            err.statusCode = 409;
            throw err;
        }

        const shift = await attendanceRepo.getEmployeeShift(client, employeeId);
        const policy = await attendanceRepo.getAttendancePolicy(client, employeeId);

        const calculation = calculateAttendance(attendance.check_in_time, new Date(), shift, policy);
        const updated = await attendanceRepo.checkOut(client, attendance.id, calculation);

        await client.query('COMMIT');

        return updated;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/* Attendance Calculation */
const calculateAttendance = (checkIn, checkOut, shift, policy) => {

    const totalHours = (checkOut - new Date(checkIn)) / (1000 * 60 * 60);

    const shiftEnd = new Date(`${checkOut.toISOString().substring(0, 10)}T${shift.end_time}`);

    const overTime = Math.max(0, (checkOut - shiftEnd) / (1000 * 60 * 60));

    let earlyDeparture = 0;

    if(checkOut < shiftEnd) {
        earlyDeparture = Math.round((shiftEnd - checkOut) / (1000 * 60)); 
    }

    let status = 'PRESENT';
    if(totalHours < policy.half_day_hours) {
        status = 'ABSENT';
    }
    else if (totalHours < policy.full_day_hours) {
        status = 'HALF_DAY';
    }

    return {
        totalHours,
        overTime, 
        earlyDeparture, 
        status,
        checkOut
    }

}

/* Late Minutes */
const calculateLateMinutes = (checkIn, officeStart, grace) => {

    const inTime = new Date(checkIn);

    const office = new Date(`${checkIn.substring(0, 10)}T${officeStart}`);

    office.setMinutes(
        office.getMinutes() + grace
    );

    if(inTime <= office) {
        return 0;
    }

    return Math.round((inTime - office) / (1000 * 60));

}

module.exports = {
    createAttendance,
    getAttendances,
    checkIn,
    checkOut,
};