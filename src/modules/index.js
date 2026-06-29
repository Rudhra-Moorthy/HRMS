const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const requirementRoutes = require('./requirement/requirementRoutes');
const recruitmentRoutes = require('./recruitment/recuitmentRoutes');
const announcementRoutes = require('./attendance/announcement/announcementRoutes');
const resignationRoutes = require('./resignation/resignationRoutes');
const attendanceRoutes = require('./attendance/attendance');
const timeTrackerRoutes = require('./timeTracker');

router.use('/auth', authRoutes);

router.use('/employees', employeeRoutes);

router.use('/requirements', requirementRoutes);

router.use('/recruitment', recruitmentRoutes);

router.use('/announcements', announcementRoutes);

router.use('/resignations', resignationRoutes);

router.use('/attendance', attendanceRoutes);

router.use('/time-tracker', timeTrackerRoutes);

module.exports = router;