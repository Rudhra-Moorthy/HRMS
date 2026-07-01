const express = require('express');
const router = express.Router();

// Import the module routes
const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const attendanceRoutes = require('./attendance/routes/attendaneRoutes');
const attendanceRegularizationRoutes = require('./attendance/routes/attendanceRegularizationRoutes');
const attendanceRegularizationHistoryRoutes = require('./attendance/routes/attendanceRegularizationHistoryRoutes');
const attendanceReportRoutes = require('./attendance/routes/attendanceReportRoutes');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/attendance-regularizations', attendanceRegularizationRoutes);
router.use('/attendance-regularizations-history', attendanceRegularizationHistoryRoutes);
router.use('/attendance-report', attendanceReportRoutes);

module.exports = router;