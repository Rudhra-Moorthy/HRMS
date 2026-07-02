const express = require("express");
const router = express.Router();
const controller = require("../controller/attendanceReportController");
const {
  validateAttendanceReport,
} = require("../middleware/attendanceReportValidation");
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");

/* Attendance Report */

/**
 * @swagger
 * tags:
 *   - name: Attendance Reports
 *     description: Attendance Report Management APIs
 */

/**
 * @swagger
 * /attendance-report:
 *   get:
 *     summary: Get attendance report
 *     description: Retrieves a paginated attendance report with optional filters.
 *     tags:
 *       - Attendance Reports
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 7
 *
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         example: 2
 *
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         example: 10
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: John
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Attendance report fetched successfully
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       500:
 *         description: Server side error
 */
router.get(
  "/",
  authenticate,
  authorize("attendance.report.view"),
  validateAttendanceReport,
  controller.getAttendanceReport,
);

/**
 * @swagger
 * /attendance-report/summary:
 *   get:
 *     summary: Get attendance summary
 *     description: Returns attendance summary statistics for the selected month and year.
 *     tags:
 *       - Attendance Reports
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 7
 *
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         example: 2
 *
 *     responses:
 *       200:
 *         description: Attendance summary fetched successfully
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       500:
 *         description: Server side error
 */
router.get(
  "/summary",
  authenticate,
  authorize("attendance.report.summary"),
  validateAttendanceReport,
  controller.getAttendanceSummary,
);

/**
 * @swagger
 * /attendance-reports/export:
 *   get:
 *     summary: Export attendance report
 *     description: Retrieves attendance report data for exporting to Excel, CSV or PDF.
 *     tags:
 *       - Attendance Reports
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 7
 *
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         example: 2
 *
 *     responses:
 *       200:
 *         description: Attendance report exported successfully
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       500:
 *         description: Server side error
 */
router.get(
  "/export",
  authenticate,
  authorize("attendance.report.export"),
  validateAttendanceReport,
  controller.exportAttendanceReport,
);

module.exports = router;
