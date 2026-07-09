/* Check Employee */
const getEmployee = async (client, employeeId) => {

    const query = `
        SELECT 
            id,
            status
        FROM employees
        WHERE id = $1;
    `;

    const result = await client.query(query, [employeeId]);
    return result.rows[0];

}

/* Check Reporting Manager */
const getReportingManager = async (client, employeeId) => {

    const query = `
        SELECT 
            manager_id
        FROM employee_reporting_manager
        WHERE 
            employee_id = $1 AND 
            effective_to IS NULL
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);
    return result.rows[0];

} 

/* Check Pending Resignation */
const getPendingResignation = async (client, employeeId) => {

    const query = `
        SELECT 
            id
        FROM resignations 
        WHERE 
            employee_id = $1 AND status NOT IN ('COMPLETED', 'CANCELLED', 'MANAGER_REJECTED', 'HR_REJECTED')
        LIMIT 1;

    `;

    const result = await client.query(query, [employeeId]);
    return result.rows[0];

}

/* Validate Reason */
const getReason = async (client, reasonId) => {

    const query = `
        SELECT 
            id
        FROM resignation_reasons
        WHERE id = $1 AND is_active = TRUE;
    `;

    const result = await client.query(query, [reasonId]);
    return result.rows[0];

}

/* Create Resignation */
const createResignation = async (client, dto) => {

    const query = `
        INSERT INTO resignations (
            employee_id,
            reporting_manager_id,
            reason_id,
            resignation_date,
            notice_period_days,
            last_working_day,
            additional_details
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [
        dto.employeeId, 
        dto.reportingManagerId, 
        dto.reasonId, 
        dto.resignationDate, 
        dto.noticePeriodDays, 
        dto.lastWorkingDay, 
        dto.additionalDetails
    ];

    const result = await client.query(query, values);
    return result.rows[0];

}

/* Insert History */
const logHistory = async (client, resignationId, action, employeeId, oldStatus, newStatus, remarks) => {

    const query = `
        INSERT INTO resignation_history(
            resignation_id,
            action,
            action_by,
            old_status,
            new_status,
            remarks
        )
        VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const values = [resignationId, action, employeeId, oldStatus, newStatus, remarks];

    await client.query(query, values);

}

/* Get resignation by employeeId */
const getEmployeeResignation = async (client, employeeId) => {

    const query = `
        SELECT 
            r.*,
            rr.reason_name,
            e.full_name,
            m.full_name AS reporting_manager
        FROM resignations r
        JOIN resignation_reasons rr
            ON rr.id = r.reason_id
        JOIN employees e
            ON e.id = r.employee_id
        LEFT JOIN employees m
            ON m.id = r.reporting_manager_id
        WHERE r.employee_id = $1
        ORDER BY r.created_at DESC
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);

    return result.rows[0];

}

/* Pending Resingations */
const getPendingResignations = async (client, managerId) => {

    const query = `
        SELECT
            r.id,
            r.employee_id,
            e.emp_code,
            e.full_name,
            d.dept_name,
            rr.reason_name,
            r.resignation_date,
            r.last_working_day,
            r.notice_period_days,
            r.status
        FROM resignations r
        JOIN employees e
            ON e.id = r.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        JOIN resignation_reasons
            ON rr.id = r.reason_id
        WHERE 
            r.reporting_manager_id = $1 AND
            r.status = 'PENDING'
        ORDER BY r.created_at ASC;
    `;

    const result = await client.query(query, [managerId]);

    return result.rows;
}

/* Get resignation by id */
const getResignation = async (client, id) => {

    const query = `
        SELECT 
            r.*,
            e.full_name,
            e.emp_code,
            d.dept_name,
            rr.reason_name,
            m.full_name AS manager_name
        FROM resignations r
        JOIN employees e
            ON e.id = r.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        JOIN resignation_reasons rr
            ON  rr.id = r.reason_id
        LEFT JOIN employees m
            ON m.id = r.reporting_manager_id
        WHERE r.id = $1;
    `;

    const result = await client.query(query, [id]);
    return result.rows[0];

}

/* Approve Request */
const approveResignation = async (client, id, managerId) => {

    const query = `
        UPDATE resignations
        SET
            status = 'MANAGER_APPROVED',
            manager_action_at = NOW(),
            updated_at = NOW()
        WHERE id = $1 AND reporting_manager_id = $2
        RETURNING *;
    `;

    const result = await client.query(query, [id, managerId]);
    return result.rows[0];

}

/* Reject Request */
const rejectResignation = async (client, id, managerId) => {

    const query = `
        UPDATE resignations
        SET 
            status = 'MANAGER_REJECTED',
            manager_action_at = NOW(),
            updated_at = NOW()
        where id = $1 AND reporting_manager_id = $2
        RETURNING *;
    `;

    const result = await client.query(query, [id, managerId]);
    return result.rows[0];

}

/* HR Pending resignation requests */
const getHrPendingResignations = async (client) => {

    const query = `
        SELECT 
            r.id,
            e.emp_code,
            e.full_name,
            d.dept_name,
            rr.reason_name,
            r.resignation_date,
            r.last_working_day,
            r.notice_period_days,
            m.full_name AS reporting_manager
        FROM resignations r
        JOIN employees e
            ON e.id = r.employee_id
        JOIN departments d
            ON d.id = e.dept_id
        JOIN resignation_reasons rr
            ON rr.id = r.reason_id
        LEFT JOIN employees m
            ON m.id = r.reporting_manager_id
        WHERE status = 'MANAGER_APPROVED'
        ORDER BY r.created_at;
    `;

    const result = await client.query(query);
    return result.rows;
}

/* Hr Approve */
const hrApproveResignation = async (client, resignationId) => {

    const query = `
        UPDATE resignations
        SET 
            status = 'HR_APPROVED',
            hr_action_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [resignationId]);
    return result.rows[0];

}

/* HR reject */
const hrRejectResignation = async (client, resignationId) => {

    const query = `
        UPDATE resignations 
        SET 
            status = 'HR_REJECTED',
            hr_action_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await client.query(query, [resignationId]);
    return result.rows[0];

}

/* Exit clearance */
const createExitClearance = async (client, resignation) => {

    const query = `
        INSERT INTO exit_clearance (
            resignation_id,
            employee_id,
            overall_status,
            initiated_by,
            initiated_at
        )
        VALUES ($1, $2, 'PENDING', $3, NOW())
        RETURNING *;
    `;

    const result = await client.query(query, [resignation.id, resignation.employee_id, resignation.hr_approved_by]);
    return result.rows[0];

}

/* Get Clearance templates */
const getExitClearanceTemplates = async (client) => {

    const query = `
        SELECT 
            department_id,
            display_order,
        FROM exit_clearance_department_templates
        WHERE is_active = TRUE
        ORDER BY display_order;
    `;

    const result = await client.query(query);

    return result.rows;
}

/* Get Department approver */
const getDepartmentApprover = async (client, departmentId) => {
    
    const query = `
        SELECT 
            employee_id
        FROM department_approvers
        WHERE
            department_id = $1 AND
            is_primary = TRUE AND 
            (effective_to IS NULL OR effective_to >= CURRENT_DATE)
        LIMIT 1;
    `;

    const result = await client.query(query, [departmentId]);
    return result.rows[0];

}

/* Get reporting manager */
const getReportingManager = async (client, employeeId) => {

    const query = `
        SELECT 
            manager_id
        FROM employee_reporting_manager
        WHERE 
            employee_id = $1 AND 
            effective_to IS NULL
        LIMIT 1;
    `;

    const result = await client.query(query, [employeeId]);
    return result.rows[0];

}

/* Create one clearance task */
const createExitClearanceTask = async (client, task) => {

    const query = `
        INSERT INTO exit_clearance_tasks (
            clearance_id,
            department_id,
            assigned_to,
            task_type,
            task_name,
            status
        )
        VALUES ($1, $2, $3, $4, $5, 'PEDNING')
        RETURNING *;
    `;
    const values = [task.clearanceId, task.departmentId, task.assignedTo, task.taskType, task.taskName];

    const result = await client.query(query, values);

    return result.rows[0];

}

/* Generate exit clearance tasks */
const createExitClearanceTasks = async (client, clearanceId, employeeId) => {

    /* Reporting Manager Task */
    const reportingManager = await getReportingManager(client, employeeId);
    if(reportingManager) {
        await createExitClearanceTask(
            client, 
            {
                clearanceId,
                departmentId: null,
                assignedTo: reportingManager.manager_id,
                taskType: 'REPORTING_MANAGER',
                taskName: 'Reporting Manager Clearance'
            }
        );
    }

    /* Department tasks */
    const templates = await getExitClearanceTemplates(client);
    for(const template of templates) {

        const approver = await getDepartmentApprover(client, template.department_id);
        if(!approver) {
            continue;
        }
        await createExitClearanceTask(
            client, 
            {
                clearanceId,
                departmentId: template.department_id,
                assignedTo: approver.employee_id,
                taskType: 'DEPARTMENT',
                taskName: null
            }
        );
    }

}

/* Create exit clearance assets */
const createExitClearanceAssets = async (client, clearanceId, employeeId) => {

    const query = `
        SELECT 
            id,
            asset_id
        FROM employee_assets
        WHERE 
            employee_id = $1 AND
            returned_date IS NULL;
    `;

    const assest = await client.query(query, [employeeId]);

    for(const asset of assets.rows) {

        await client.query(
            `
                INSERT INTO exit_clearance_assets (
                    clearance_id,
                    employee_asset_id,
                    asset_id,
                    returned
                )
                VALUES ($1, $2, $3, FALSE);
            `,
            [clearanceId, asset.id, asset.asset_id]
        );
    }

}



module.exports = {
    getEmployee,
    getPendingResignation,
    getReason,
    getReportingManager,
    createResignation,
    logHistory,
    getEmployeeResignation,
    getPendingResignations,
    getResignation,
    approveResignation,
    rejectResignation,
    getHrPendingResignations,
    hrApproveResignation,
    hrRejectResignation,
    createExitClearance,
    createExitClearanceTasks,
    createExitClearanceAssets,
};