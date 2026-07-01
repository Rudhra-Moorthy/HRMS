const express = require("express");
const router = express.Router();
const controller = require("../controller/attendanceReportController");
const { validateAttendanceReport } = require("../middleware/attendanceReportValidation");
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");

/* Attendance Report */
router.get(
  "/",
  authenticate,
  authorize("attendance.report.view"),
  validateAttendanceReport,
  controller.getAttendanceReport,
);

router.get(
  "/summary",
  authenticate,
  authorize("attendance.report.summary"),
  validateAttendanceReport,
  controller.getAttendanceSummary,
);

router.get(
  "/export",
  authenticate,
  authorize("attendance.report.export"),
  validateAttendanceReport,
  controller.exportAttendanceReport,
);

module.exports = router;
