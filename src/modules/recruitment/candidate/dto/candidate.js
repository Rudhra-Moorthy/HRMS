const candidateDto = (candidate) => {

    if (!candidate) return null;

    return {
        id: candidate.id,
        requirementId: candidate.requirement_id,
        fullName: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        experience: candidate.experience,
        status: candidate.status,
        createdAt: candidate.created_at,
        updatedAt: candidate.updated_at
    };

};

module.exports = candidateDto;