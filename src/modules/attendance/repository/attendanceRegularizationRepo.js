/* Get attendance */
const getAttendance = async (client, attendanceId) => {

    const query = `
        SELECT * 
        FROM attendances
        WHERE id = $1;
    `;

    const result = await client.query(query, [attendanceId]);

    return result.rows[0];

}

/* Get pending requests */
const getPendingRegulaization = async (client, attendanceId) => {

    const query = `
        SELECT * 
        FROM attendance_regularizations
        WHERE attendance_id = $1 AND status = 'PENDING'
        LIMIT 1;
    `;

    const result = await client.query(query, [attendanceId]);
    return result.rows[0];

}

/* Create Regularization */
const createRegularization = async (client, employeeId, dto) => {

    const query = `
        INSERT INTO attendance_regularizations (
            attendance_id, 
            employee_id,
            regularization_date,
            request_type,
            reason,
            requested_check_in,
            requested_check_out,
            status,
            created_at
        )
        VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, 'PENDING', NOW())
        RETURNING *;
    `;
    const values = [dto.attendanceId, employeeId, dto.requestType, dto.reason, dto.requestedCheckIn,dto.requestedCheckOut];

    const result = await client.query(query, values);

    return result.rows[0];

}

/* Get all regularizations */
const getRegularizations = async (pool, filters) => {

    let query = `
        SELECT 
            ar.*,
            e.full_name,
            a.attendance_date
        FROM attendance_regularizations ar
        JOIN employees e
            ON ar.employee_id = e.id
        JOIN attendances a
            ON ar.attendance_id = a.id
        WHERE 1 = 1
    `;

    const values = [];
    let idx = 1;

    if(filters.employeeId) {
        query += ` AND ar.employee_id = $${idx++}`;
        values.push(filters.employeeId);
    }

    query += ` ORDER BY ar.created_at DESC`;

    const result = await pool.query(query, values);

    return result.rows;
}

/* Get regularization by ID */
const getRegularization = async (pool, regularizationId) => {

    const query = `
        SELECT *
        FROM attendance_regularizations
        WHERE regularization_id = $1;
    `;

    const result = await pool.query(query, [regularizationId]);

    return result.rows[0];

}

/* Update regularization */
const updateRegularization = async (client, id, dto) => {

    const query = `
        UPDATE attendance_regularizations
        SET 
            request_type = $1,
            requested_check_in = $2,
            requested_check_out = $3,
            reason = $4,
            updated_at = NOW()
        WHERE regularization_id = $5
        RETURNING *;
    `;
    const values = [dto.requestType, dto.requestedCheckIn, dto.requestedCheckOut, dto.reason, id];

    const result = await client.query(query, values);

    return result.rows[0];

}

/* Approve Request for attendance regularization */
const approveRegularization = async (client, id, managerId) => {
    
    const query = `
        UPDATE attendance_regularizations 
        SET 
            status = 'APPROVED',
            approved_by = $1,
            approved_at = NOW(),
            updated_at = NOW()
        WHERE regularization_id = $2
        RETURNING *;
    `;
    const values = [managerId, id];
    
    const result = await client.query(query, values);

    return result.rows[0];

}

/* Reject request */
const rejectRegularization = async (client, id, managerId, reason) => {

    const query = `
        UPDATE attendance_regularizations
        SET 
            status = 'REJECTED',
            approved_by = $1,
            approved_at = NOW(),
            rejected_reason = $2,
            updated_at = NOW()
        WHERE regularization_id = $3
        RETURNING *;
    `;

    const result = await client.query(query, [managerId, reason, id]);

    return result.rows[0];

}

/* Update attendance after approval */
const updateAttendanceAfterApproval = async (client, regularization) => {

    const query = `
        UPDATE attendances 
        SET 
            check_in_time = COALESCE($1, check_in_time),
            check_out_time = COALESCE($2, check_out_time),
            updated_at = NOW()
        WHERE id = $3
        RETURNING *;
    `;
    const values = [regularization.requested_check_in, regularization.requested_check_out, regularization.attendance_id];

    const result = await client.query(query, values);

    return result.rows[0];

}

/* Get Repoting managerId */
const getReportingManager = async (client, employeeId) => {

    const query = `
        SELECT 
            employee_id, 
            manager_id
        FROM employee_reporting_manager
        WHERE employee_id = $1 AND effective_to IS NULL
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows[0] || null;

}

/* Recalculate Attendance after approved */
const recalculateAttendance = async (client, attendanceId) => {

    /* Get attendance Details */
    const attendanceResult = await client.query(
        `
            SELECT 
                a.*,
                ap.office_start_time,
                ap.office_end_time,
                ap.grace_period_minutes,
                ap.full_day_hours,
                ap.half_day_hours,
                s.start_time,
                s.end_time
            FROM attendances a
            JOIN attendance_policies ap 
                ON ap.policy_id = a.attendance_policy_id
            JOIN shifts s
                ON s.shift_id = a.shift_id
            WHERE a.id = $1;
        `,
        [attendanceId]
    );

    if(attendanceResult.rows.length === 0) {
        return null;
    }

    const attendance = attendanceResult.rows[0];

    if(!attendance.check_in_time || !attendance.check_out_time) {
        return attendance;
    }

    /* Attendance Date */
    const attendanceDate = attendance.attendance_date.toISOString().split('T')[0];

    /* Check-In / Check-Out */
    const checkIn = new Date(attendance.check_in_time);
    const checkOut = new Date(attendance.check_out_time);

    /* Shift start time & Shift end time */
    const shiftStart = new Date(`${attendanceDate}T${attendance.start_time}`);
    const shiftEnd = new Date(`${attendanceDate}T${attendance.end_time}`);

    /* Grace time */
    shiftStart.setMinutes(
        shiftStart.getMinutes() + attendance.grace_period_minutes
    );

    /* Late Minutes */
    let lateMinutes = 0;
    if(checkIn > shiftStart) {
        lateMinutes = Math.round((checkIn - shiftStart) / (1000 * 60));
    }

    /* Total Hours */
    const totalHours = Number(
        ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2)
    );

    /* Early Departure */
    let earlyDeparture = 0;
    if(checkOut < shiftEnd) {
        earlyDeparture = Math.round(
            (shiftEnd - checkOut) / (1000 * 60)
        );
    }

    /* Over time */
    let overTime = 0;
    if(checkOut > shiftEnd) {
        overTime = Number(
            ((checkOut - shiftEnd) / (1000 * 60 * 60)).toFixed(2)
        );
    }

    /* Attendance Status */
    let status = 'PRESENT';
    if(totalHours < attendance.half_day_hours) {
        status = 'ABSENT';
    }
    else if(totalHours < attendance.full_day_hours) {
        status = 'HALF_DAY';
    }

    /* Update Attendance */
    const updateQuery = `
        UPDATE  attendances
        SET
            late_minutes = $1,
            total_hours = $2,
            overtime_hours = $3,
            early_departure_minutes = $4,
            attendance_status = $5,
            updated_at = NOW()
        WHERE id = $6
        RETURNING *;
    `;

    const values = [lateMinutes, totalHours, overTime, earlyDeparture, status, attendanceId];

    const result = await client.query(updateQuery, values);
    return result.rows[0];

}

module.exports = {
    getAttendance,
    getPendingRegulaization,
    createRegularization,
    getRegularizations,
    getRegularization,
    updateRegularization,
    approveRegularization,
    rejectRegularization,
    updateAttendanceAfterApproval,
    getReportingManager,
    recalculateAttendance
}   