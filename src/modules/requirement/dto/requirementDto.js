const requirementDto = (requirement) => {

    if (!requirement) return null;

    return {
        id: requirement.id,
        requirementCode: requirement.requirement_code,
        position: requirement.position,
        deptId: requirement.dept_id,    
        vacancies: requirement.vacancies,
        experienceRequired: requirement.experience_required,
        jobDescription: requirement.job_description,
        priority: requirement.priority,
        status: requirement.status,
        postedDate: requirement.created_at.toISOString().split('T')[0]
    };
};

module.exports = requirementDto;