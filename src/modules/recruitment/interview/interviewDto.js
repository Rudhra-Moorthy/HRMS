const interviewDto = (interview) => {

    if (!interview) return null;

    return {
        id: interview.id,
        candidateId: interview.candidate_id,
        interviewerId: interview.interviewer_id,
        interviewType: interview.interview_type,
        interviewDate: interview.interview_date,
        startTime: interview.start_time,
        endTime: interview.end_time,
        meetingLink: interview.meeting_link,
        status: interview.status,
        feedback: interview.feedback,
        createdAt: interview.created_at,
        updatedAt: interview.updated_at
    };

};

module.exports = interviewDto;