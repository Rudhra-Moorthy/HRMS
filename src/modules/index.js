const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const requirementRoutes = require('./requirement/requirementRoutes');
const recruitmentRoutes = require('./recruitment/recuitmentRoutes');
const announcementRoutes = require('./announcement/announcementRoutes');
const resignationRoutes = require('./resignation/resignationRoutes');
const attendanceRoutes = require('./attendance/routes/attendaneRoutes');
const timeTrackerRoutes = require('./timeTracker/timeTrackerRoutes');
const attendanceRegularizationRoutes = require('./attendance/routes/attendanceRegularizationRoutes');
const attendanceRegularizationHistoryRoutes = require('./attendance/routes/attendanceRegularizationHistoryRoutes');
const attendanceReportRoutes = require('./attendance/routes/attendanceReportRoutes');

router.use('/auth', authRoutes);

router.use('/employees', employeeRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/attendance-regularizations', attendanceRegularizationRoutes);
router.use('/attendance-regularizations-history', attendanceRegularizationHistoryRoutes);
router.use('/attendance-report', attendanceReportRoutes);

router.use('/requirements', requirementRoutes);

router.use('/recruitment', recruitmentRoutes);

router.use('/announcements', announcementRoutes);

router.use('/resignations', resignationRoutes);

router.use('/attendance', attendanceRoutes);

router.use('/time-tracker', timeTrackerRoutes);

module.exports = router;