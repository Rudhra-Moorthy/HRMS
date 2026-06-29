const attendanceRepo = require('../repository/attendanceRepo');
const attendanceDto = require('../dto/attendance');

const checkIn = async (body) => {

    const attendance = await attendanceRepo.checkIn(body);

    return attendanceDto(attendance);

};

const checkOut = async (employeeId) => {

    const attendance = await attendanceRepo.checkOut(employeeId);

    return attendanceDto(attendance);

};

const getTodayAttendance = async (employeeId) => {

    const attendance = await attendanceRepo.getTodayAttendance(employeeId);

    return attendanceDto(attendance);

};

const getAttendanceHistory = async () => {

    const attendances = await attendanceRepo.getAttendanceHistory();

    return attendances.map(attendanceDto);

};
const getAttendanceReport = async () => {

    return await attendanceRepo.getAttendanceReport();

};

module.exports = {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceReport,
    getAttendanceHistory
};