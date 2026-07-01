const express = require('express');
const router = express.Router();

// Import the module routes
const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const attendanceRoutes = require('./attendance/routes/attendaneRoutes');
const attendanceRegularizationRoutes = require('./attendance/routes/attendanceRegularizationRoutes');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/attendance-regularizations', attendanceRegularizationRoutes);

module.exports = router;