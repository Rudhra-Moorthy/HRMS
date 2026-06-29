const express = require('express');

const router = express.Router();

const attendanceController = require('./controller/attendanceController');

router.post('/check-in', attendanceController.checkIn);

router.put('/check-out', attendanceController.checkOut);

router.get('/today/:employeeId', attendanceController.getTodayAttendance);

router.get('/history', attendanceController.getAttendanceHistory);

router.get('/report', attendanceController.getAttendanceReport);

module.exports = router;
