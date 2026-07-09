const exitClearance = (data) => {

    if(!data) {
        return null;
    }

    return  {

        id: data.id,
        employeeId: data.employee_id,
        employeeCode: data.emp_code,
        employeeName: data.full_name,
        department: data.dept_name,
        resignationId: data.resignation_id,
        status: data.overall_status,
        initiatedAt: data.initiated_at,
        completedAt: data.completed_at
        
    };
    
}

module.exports = exitClearance;