const interviewRepo = require('../repository/interviewRepo');
const interviewDto = require('../dto/interview');

const createInterview = async (body) => {

    const result = await interviewRepo.createInterview(body);

    return interviewDto(result);

};

const getAllInterviews = async () => {

    const interviews = await interviewRepo.getAllInterviews();

    return interviews.map(interviewDto);

};

const getInterviewById = async (id) => {

    const interview = await interviewRepo.getInterviewById(id);

    return interviewDto(interview);

};

const updateInterview = async (id, body) => {

    const result = await interviewRepo.updateInterview(id, body);

    return interviewDto(result);

};

const deleteInterview = async (id) => {

    return await interviewRepo.deleteInterview(id);

};

module.exports = {
    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};