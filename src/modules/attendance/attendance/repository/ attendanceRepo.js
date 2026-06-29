const pool = require('../../../../config/db');
const checkIn = async (attendance) => {

    const query = `
        INSERT INTO attendances
        (
            employee_id,
            attendance_date,
            check_in_time,
            location,
            attendance_status
        )
        VALUES
        ($1,CURRENT_DATE,NOW(),$2,'Present')
        RETURNING *;
    `;

    const values = [
        attendance.employee_id,
        attendance.location
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};
const getTodayAttendance = async (employeeId) => {

    const query = `
        SELECT *
        FROM attendances
        WHERE employee_id=$1
        AND attendance_date=CURRENT_DATE;
    `;

    const result = await pool.query(query,[employeeId]);

    return result.rows[0];

};
const checkOut = async (employeeId) => {

    const query = `
        UPDATE attendances
        SET
            check_out_time = NOW(),

            total_hours =
            ROUND(
                EXTRACT(
                    EPOCH FROM (NOW() - check_in_time)
                ) / 3600,
                2
            ),

            updated_at = NOW()

        WHERE employee_id=$1
        AND attendance_date=CURRENT_DATE

        RETURNING *;
    `;

    const result = await pool.query(query,[employeeId]);

    return result.rows[0];

};
const getAttendanceHistory = async () => {

    const query = `
        SELECT *
        FROM attendances
        ORDER BY attendance_date DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

};
const getAttendanceReport = async () => {

    const query = `

        SELECT

            e.id,
            e.full_name,
            d.dept_name,

            COUNT(
                CASE
                    WHEN a.attendance_status='Present'
                    THEN 1
                END
            ) AS present,

            COUNT(
                CASE
                    WHEN a.attendance_status='Absent'
                    THEN 1
                END
            ) AS absent,

            COUNT(
                CASE
                    WHEN a.late_minutes>0
                    THEN 1
                END
            ) AS late,

            COUNT(
                CASE
                    WHEN a.total_hours<4
                    THEN 1
                END
            ) AS half_day,

            COUNT(a.id) AS total_days,

            ROUND(

                COUNT(
                    CASE
                        WHEN a.attendance_status='Present'
                        THEN 1
                    END
                ) *100.0/

                NULLIF(COUNT(a.id),0),

            2)

            AS attendance_percentage

        FROM employees e

        LEFT JOIN attendances a

        ON e.id=a.employee_id

        LEFT JOIN departments d

        ON e.dept_id=d.id

        GROUP BY

            e.id,
            e.full_name,
            d.dept_name

        ORDER BY
            e.full_name;

    `;

    const result = await pool.query(query);

    return result.rows;

};
module.exports = {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceHistory,
    getAttendanceReport
};