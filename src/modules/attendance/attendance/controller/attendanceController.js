const attendanceService = require('../service/attendanceService');

const checkIn = async (req, res) => {

    try {

        const {
            employee_id,
            location
        } = req.body;

        if (!employee_id || !location) {

            return res.status(400).json({
                success: false,
                message: "Employee ID and location are required"
            });

        }

        const data = await attendanceService.checkIn(req.body);

        return res.status(201).json({
            success: true,
            message: "Check In successful",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


const checkOut = async (req, res) => {

    try {

        const { employee_id } = req.body;

        if (!employee_id) {

            return res.status(400).json({
                success: false,
                message: "Employee ID is required"
            });

        }

        const data = await attendanceService.checkOut(employee_id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Check Out successful",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


const getTodayAttendance = async (req, res) => {

    try {

        const data = await attendanceService.getTodayAttendance(req.params.employeeId);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });

        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


const getAttendanceHistory = async (req, res) => {

    try {

        const data = await attendanceService.getAttendanceHistory();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const getAttendanceReport = async (req,res)=>{

    try{

        const data =
        await attendanceService.getAttendanceReport();

        return res.status(200).json({

            success:true,

            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

module.exports = {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceReport,
    getAttendanceHistory
};