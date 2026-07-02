const candidateDto = (candidate) => {

    if (!candidate) return null;

    return {
        id: candidate.id,
        requirementId: candidate.requirement_id,
        fullName: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        experience: candidate.experience,
        currentCompany: candidate.current_company,
        currentCtc: candidate.current_ctc,
        expectedCtc: candidate.expected_ctc,
        noticePeriod: candidate.notice_period,
        skills: candidate.skills,
        resumeUrl: candidate.resume_url,
        status: candidate.status,
    };

};

module.exports = candidateDto;