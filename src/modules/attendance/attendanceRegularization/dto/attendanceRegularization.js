const attendanceRegularizationDto = (regularization) => {

    if (!regularization) return null;

    return {
        id: regularization.id,
        attendanceId: regularization.attendance_id,
        employeeId: regularization.employee_id,
        regularizationDate: regularization.regularization_date,
        requestType: regularization.request_type,
        reason: regularization.reason,
        requestedCheckIn: regularization.requested_check_in,
        requestedCheckOut: regularization.requested_check_out,
        status: regularization.status,
        approvedBy: regularization.approved_by,
        approvedAt: regularization.approved_at,
        rejectedReason: regularization.rejected_reason,
        createdAt: regularization.created_at,
        updatedAt: regularization.updated_at
    };

};

module.exports = attendanceRegularizationDto;