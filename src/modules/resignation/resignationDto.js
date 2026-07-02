const resignationDto = (resignation) => {

    if (!resignation) return null;

    return {
        id: resignation.id,
        employeeId: resignation.employee_id,
        resignationDate: resignation.resignation_date,
        lastWorkingDay: resignation.last_working_day,
        reason: resignation.reason,
        status: resignation.status,
        approvedBy: resignation.approved_by,
        approvedAt: resignation.approved_at,
        remarks: resignation.remarks,
        createdAt: resignation.created_at,
        updatedAt: resignation.updated_at
    };

};

module.exports = resignationDto;