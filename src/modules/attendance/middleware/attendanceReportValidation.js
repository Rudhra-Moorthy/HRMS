const  { attendanceReportSchema } = require('../dto/attendanceReport.dto');

const validateAttendanceReport = (req, res, next) => {

    const { error } = attendanceReportSchema.validate(req.query);

    if(error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message 
        });
    }

    next();

}

module.exports = { validateAttendanceReport }