const service = require('../service/attendanceReportService');

/* Attendance report */
const getAttendanceReport = async (req, res) => {

    try {

        const report = await service.getAttendanceReport(pool, req.query);

        return res.status(200).json({
            success: true,
            message: "Attendance Report has been fetched successfully",
            ...report
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Attendance Summary */
const getAttendanceSummary = async (req, res) => {

    try {
        const summary = await service.getAttendanceSummary(pool, req.query);

        return res.status(200).json({
            success: true,
            message: 'Attendance summary fetched successfully',
            data: summary
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}


/* Export API */
const exportAttendanceReport = async (req, res) => {

    try {

        const report = await service.exportAttendanceReport(req.query);

        return res.status(300).json({
            success: true,
            message: 'Attendance report for export has been fetched successfully.',
            data: report
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

module.exports = {
    getAttendanceReport,
    getAttendanceSummary,
    exportAttendanceReport
}