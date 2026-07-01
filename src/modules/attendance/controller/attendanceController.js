const attendanceService = require('../service/attendanceService');

/* Post Attendance */
const createAttendance = async (req, res) => {
    
    try {

        const attendance = await attendanceService.createAttendance(req.body);

        return res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get all attendances */
const getAttendances = async (req, res) => {

    try {

        const result = await attendanceService.getAttendances(req.query);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Get attendace by employee id*/
const getAttendance = async (req, res) => {

    try {

        const attendance = await attendanceService.getAttendance(req.params.id);

        return res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

/* Check in */
const checkIn = async (req, res) => {

    try {
        
        const attendanceCheckIn = await attendanceService.checkIn(req.body);

        return res.status(201).json({
            success: true,
            message: 'Checked In successfully',
            data: attendanceCheckIn
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

/* Check out */
const checkOut = async (req, res) => {

    try {
        const attendanceCheckOut = await attendanceService.checkOut(req.body.employeeId);

        return res.status(200).json({
            success: true,
            message: 'Checked Out successfully',
            data: attendanceCheckOut
        });

    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    createAttendance,
    getAttendances,
    getAttendance,
    checkIn,
    checkOut,
};