const attendanceRegularizationRepo = require('../repository/attendanceRegularizationRepo');
const attendanceRegularizationDto = require('../dto/attendanceRegularization');

const createRequest = async (body) => {

    const result = await attendanceRegularizationRepo.createRequest(body);

    return attendanceRegularizationDto(result);

};

const getAllRequests = async () => {

    const requests = await attendanceRegularizationRepo.getAllRequests();

    return requests.map(attendanceRegularizationDto);

};

const getRequestById = async (id) => {

    const request = await attendanceRegularizationRepo.getRequestById(id);

    return attendanceRegularizationDto(request);

};

const approveRequest = async (id, approvedBy) => {

    const result = await attendanceRegularizationRepo.approveRequest(id, approvedBy);

    if(result){

        await attendanceRegularizationRepo.updateAttendance(id);

    }

    return attendanceRegularizationDto(result);

};

const rejectRequest = async (id, rejectedReason) => {

    const result = await attendanceRegularizationRepo.rejectRequest(id, rejectedReason);

    return attendanceRegularizationDto(result);

};

module.exports = {

    createRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest

};