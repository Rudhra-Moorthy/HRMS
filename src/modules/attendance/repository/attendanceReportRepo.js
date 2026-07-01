/* Attendance Report */
const getAttendanceReport = async (pool, filters) => {

    const {
        month,
        year,
        departmentId,
        employeeId,
        page,
        limit,
        search
    } = filters;

    const values = [];
    let idx = 1;

    let where = `
        WHERE
            EXTRACT(MONTH FROM a.attendance_date) = $${idx++} AND
            EXTRACT(YEAR FROM a.attendance_date) = $${idx++}
    `;

    values.push(month);
    values.push(year);

    if(departmentId) {
        where += `
            AND e.dept_id = $${idx++}
        `;
        values.push(departmentId);
    }

    if(employeeId) {
        where += `
            AND e.id = $${idx++}
        `;
        values.push(employeeId);
    }

    if(search) {
        where += `
            AND (
                LOWER(e.full_name) LIKE LOWER($${idx})
                OR LOWER(e.emp_code) LIKE LOWER($${idx})
            )
        `;
        values.push(`%${search}%`);
        idx++;
    }

    const offset = (page - 1) * limit;

    values.push(limit);
    values.push(offset);

    const query = `
        SELECT 
            e.id,
            e.emp_code,
            e.full_name,
            d.dept_name,

            COUNT(*) FILTER
            (
                WHERE a.attendance_status = 'PRESENT'
            ) AS present,

            COUNT(*) FILTER
            (
                WHERE a.attendance_status = 'ABSENT'
            ) AS absent,
            
            COUNT(*) FILTER
            (
                WHERE a.late_minutes > 0
            ) AS late,

            COUNT(*) FILTER
            (
                WHERE a.attendance_status = 'HALF_DAY'
            ) AS half_day,
            
            COUNT(*) AS total_days,

            ROUND(
                (
                    COUNT(*) FILTER
                    (
                        WHERE a.attendance_status = 'PRESENT'
                    ) :: decimal
                     /
                    NULLIF(COUNT(*), 0)
                ) * 100,
                2
            ) AS attendance_percentage
            
        FROM attendance a
        JOIN employees e
            ON e.id = a.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        ${where}
        GROUP BY
            e.id, e.emp_code, e.full_name, d.dept_name
        ORDER BY e.full_name
        LIMIT $${idx++} OFFSET $${idx++}
    `;

    const result = await pool.query(query, values);

    return result.rows;

}

/* Count */
const getAttendanceReportCount = async (pool, filters) => {

    const {
        month,
        year,
        departmentId,
        employeeId,
        search
    } = filters;

    const values = [];
    let idx = 1;

    let where = `
        WHERE
        EXTRACT(MONTH FROM a.attendance_date)=$${idx++}
        AND
        EXTRACT(YEAR FROM a.attendance_date)=$${idx++}
    `;

    values.push(month);
    values.push(year);

    if(departmentId) {
        where += `
            AND 
            e.dept_id = $${idx++}
        `;
        values.push(departmentId);
    }

    if(employeeId) {
        where += `
            AND
            e.id = $${idx++}
        `;
        values.push(employeeId);
    }

    if(search) {
        where += `
            AND 
            LOWER(e.full_name) LIKE LOWER($${idx++})
        `;
        values.push(`%${search}%`);
    }

    const query = `
        SELECT COUNT(*) as total FROM (
            SELECT e.id 
            FROM attendance a
            JOIN employees e
                ON e.id = a.employee_id
            ${where}
            GROUP BY e.id
        ) t
    `;

    const result = await pool.query(query, values);
    return Number(result.rows[0].total);
}


/* Summary Cards */
const getAddentanceSummary = async (pool, filters) =>{
    
    const {
        month,
        year,
        departmentId
    } = filters;

    const values = [];
    let idx = 1;

    let where = `
        WHERE 
        EXTRACT(MONTH FROM attendance_date) = $${idx++}
        AND
        EXTRACT(YEAR FROM attendance_date) = $${idx++}
    `;
    values.push(month);
    values.push(year);

    if(departmentId) {
        where += `
            AND 
            employee_id IN (
                SELECT id FROM employees WHERE dept_id = $${idx++}
            )
        `;
        values.push(departmentId);
    }

    const query = `
        SELECT 
            ROUND (
                (
                    COUNT(*) FILTER
                    (
                        WHERE attendance_status = 'PRESENT'
                    ):: decimal
                    /
                    NULLIF(COUNT(*), 0)
                ) * 100,
                2
            ) AS avg_attendance,

            COUNT(*) FILTER
            (
                WHERE attendance_status = 'PRESENT'
            ) AS total_present,

            COUNT(*) FILTER
            (
                WHERE attendance_status = 'ABSENT'
            ) AS total_absent,

            COUNT(*) FILTER
            (
                WHERE late_minutes > 0
            ) AS late_arrivals
        FROM attendances
        ${where}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

/* Export */
const exportAttendanceReport = async (pool, filters) => {

    const {
        month,
        year,
        departmentId
    } = filters;

    const values = [];
    let index = 1;

    let where = `
        WHERE
            EXTRACT(MONTH FROM a.attendance_date)=$${index++}
        AND
            EXTRACT(YEAR FROM a.attendance_date)=$${index++}
    `;

    values.push(month);
    values.push(year);

    if (departmentId) {

        where += `
            AND e.dept_id=$${index++}
        `;

        values.push(departmentId);

    }

    const query = `

        SELECT
            e.emp_code,
            e.full_name,
            d.dept_name,
            a.attendance_date,
            a.check_in_time,
            a.check_out_time,
            a.total_hours,
            a.attendance_status
        FROM attendances a

        JOIN employees e
        ON e.id=a.employee_id

        JOIN departments d
        ON d.id=e.dept_id

        ${where}
        ORDER BY e.full_name, a.attendance_date

    `;

    const result = await pool.query(query, values);
    return result.rows;

}

module.exports = {
    getAddentanceSummary,
    getAttendanceReport,
    getAttendanceReportCount,
    exportAttendanceReport
};
