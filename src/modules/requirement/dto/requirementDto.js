const requirementDto = (requirement) => {

    if (!requirement) return null;

    return {
        id: requirement.id,
        requirementCode: requirement.requirement_code,
        position: requirement.position,
        departmentId: requirement.dept_id,
        vacancies: requirement.vacancies,
        experienceRequired: requirement.experience_required,
        jobDescription: requirement.job_description,
        priority: requirement.priority,
        status: requirement.status,
        createdAt: requirement.created_at,
        updatedAt: requirement.updated_at
    };

};

module.exports = requirementDto;