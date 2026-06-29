const attendanceDto = (attendance) => {

    if (!attendance) return null;

    return {
        id: attendance.id,
        employeeId: attendance.employee_id,
        attendanceDate: attendance.attendance_date,
        checkInTime: attendance.check_in_time,
        checkOutTime: attendance.check_out_time,
        totalHours: attendance.total_hours,
        lateMinutes: attendance.late_minutes,
        location: attendance.location,
        attendanceStatus: attendance.attendance_status,
        remarks: attendance.remarks,
        createdAt: attendance.created_at,
        updatedAt: attendance.updated_at
    };

};

module.exports = attendanceDto;