const timeEntryDto = (timeEntry) => {

    if (!timeEntry) return null;

    return {
        id: timeEntry.id,
        employeeId: timeEntry.employee_id,
        attendanceId: timeEntry.attendance_id,
        projectName: timeEntry.project_name,
        taskName: timeEntry.task_name,
        description: timeEntry.description,
        startTime: timeEntry.start_time,
        endTime: timeEntry.end_time,
        totalHours: timeEntry.total_hours,
        createdAt: timeEntry.created_at,
        updatedAt: timeEntry.updated_at
    };
};

module.exports = timeEntryDto;