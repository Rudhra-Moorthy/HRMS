/* Existing Attendance */
const getAttendanceByEmployeeAndDate = async(client, employeeId, attendanceDate) => {

    const query = `
        SELECT id 
        FROM attendances 
        WHERE employee_id = $1 AND attendance_date = $2
    `;

    const result = await client.query(query, [employeeId, attendanceDate]);

    return result.rows[0];

}

/* Employee shift */
const getEmployeeShift = async (client, employeeId) => {

    const query = `
        SELECT s.*
        FROM employee_shifts es
        JOIN shifts s
        ON es.shift_id = s.id
        WHERE es.employee_id = $1
            AND es.effective_to IS NULL
        LIMIT 1; 
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows[0];

}

/* Attendance Policy */
const getAttendancePolicy = async (client, employeeId) => {

    const query = `
        SELECT ap.*
        FROM employee_attendance_policy ep
        JOIN attendance_policies ap
        ON ep.attendance_policy_id = ap.id
        WHERE ep.employee_id = $1 AND ep.effective_to IS NULL
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows[0];

}

/* Create attendance */
const createAttendance = async (client, dto, shift, policy, status) => {

    const query = `
        INSERT INTO attendances (
            employee_id,
            attendance_date,
            check_in_time,
            check_out_time,
            shift_id,
            attendance_policy_id,
            attendance_status,
            location
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const values = [dto.employeeId, dto.attendanceDate, dto.checkInTime, dto.checkOutTime, shift.id, policy.id, status, dto.location];

    const result = await client.query(query, values);
    return result.rows[0];

}

/* Get Attendances */
const getAttendances = async (client, filters) => {

    let query = `
        SELECT 
            a.*,
            e.full_name,
            d.department_name,
        FROM attendances a
        JOIN employees e
            ON a.employee_id = e.id
        JOIN departments d
            ON e.dept_id = d.id
        WHERE  1 = 1
    `;

    const values = [];
    let idx = 1;
    if(filters.employeeId) {
        query += `AND a.employee_id = $${idx++}`;
        values.push(filters.employeeId);
    }

    if(filters.departmentId) {
        query += ` AND d.id = $${idx++}`;
        values.push(filters.departmentId);
    }

    query += ` ORDER BY a.attendance_date DESC`;

    const result = await client.query(query, values);

    return result.rows;
}

/* Check In */
const checkIn = async (client, dto, shiftId, policyId, lateMinutes) => {

    const query = `
        INSERT INTO attendances(
            employee_id, 
            attendance_date,
            check_in_time,
            shift_id, 
            attendance_policy_id,
            late_minutes,
            attendance_status,
            location,
            remarks
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'PRESENT', $7, $8)
        RETURNING *;
    `;

    const values = [dto.employeeId, dto.attendanceDate, dto.checkInTime, shiftId, policyId, lateMinutes, dto.location, dto.remarks];

    const result = await Client.query(query, values);

    return result.roes[0];

}

/* Check Out */
const checkOut = async (client, attendanceId, data) => {

    const query = `
        UPDATE attendances
        SET
            check_out_time = $1,
            total_hours = $2,
            overtime_hours = $3,
            early_departure_minutes = $4,
            attendance_status = $5,
            updated_at = NOW()
        WHERE id = $6
        RETURNING *;
    `;

    const values = [data.checkOut, data.totalHours, data.overTime, data.earlyDaparture, data.status, attendanceId];

    const result = await client.query(query, values);

    return result.rows[0];

}

/* Checks whether the employee has an approved leave on the attendance date */
const hasApprovedLeave = async (client, employeeId, attendanceDate) => {

    const query = `
        SELECT id
        FROM leave_applications
        WHERE employee_id = $1 AND
              status = 'APPROVED' AND
              $2 BETWEEN from_date AND to_date
        LIMIT 1
    `;

    const result = await client.query(query, [employeeId, attendanceDate]);

    return result.rows[0] || null;

}

/* Checks whether the attendance date is a company holiday */
const isHoliday = async (client, attendanceDate) => {

    const query = `
        SELECT 
            holiday_id,
            holiday_name
        FROM holidays
        WHERE holiday_date = $1
        LIMIT 1;
    `;

    const result = await client.query(query, [attendanceDate]);

    return result.rows[0] || null;

}

/* Returns Today's attendance record for the employee */
const getTodayAttendance = async (client, employeeId) => {
    
    const query = `
        SELECT * 
        FROM attendances
        WHERE employee_id = $1 AND 
              attendance_date = CURRENT_DATE
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows[0] || null;

}

module.exports = {
    getAttendanceByEmployeeAndDate,
    getEmployeeShift,
    getAttendancePolicy,
    createAttendance,
    getAttendances,
    checkIn,
    checkOut,
    hasApprovedLeave,
    isHoliday,
    getTodayAttendance,
};