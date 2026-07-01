const pool = require('../../../config/db');
const repo = require('../repository/attendanceReportRepo');

/* Attendance Report */
const getAttendanceReport = async (filters) => {

    filters.month = Number(filters.month);
    filters.year = Number(filters.year);
    filters.page = Number(filters.page) || 1;
    filters.limit = Number(filters.limit) || 10;

    const attendanceReport = await repo.getAttendanceReport(pool, filters);

    const totalRecords = await repo.getAttendanceReportCount(pool, filters);

    return {
        data: attendanceReport,
        pagination : {
            page: filters.page,
            limit: filters.limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / filters.limit)
        }
    }

}

/* Attendance Summary */
const getAttendanceSummary = async (filters) => {

    filters.month = Number(filters.month);
    filters.year = Number(filters.year);

    return await repo.getAddentanceSummary(pool, filters);

}

/* Export */
const exportAttendanceReport = async (filters) => {

    filters.month = Number(filters.month);
    filters.year = Number(filters.year);

    return await repo.exportAttendanceReport(pool, filters);

}

module.exports = {
    getAttendanceReport,
    getAttendanceSummary,
    exportAttendanceReport,
};