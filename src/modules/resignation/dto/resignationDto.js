const resignationDto = (resignation) => {

    if (!resignation) return null;

    return {
        id: resignation.id,
        employeeId: resignation.full_name,
        resignationManagerId: resignation.reporting_manager,
        resignationDate: resignation.resignation_date,
        lastWorkingDay: resignation.last_working_day,
        noticePeriodDays: resignation.notice_period_days,
        reasonId: resignation.reason_name,
        additionalDetails: resignation.additional_details,
        status: resignation.status,
        createdAt: resignation.created_at
    };

};

module.exports = resignationDto;