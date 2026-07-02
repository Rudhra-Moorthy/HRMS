const express = require("express");
const router = express.Router();
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");
const attendanceController = require("../controller/attendanceController");

/* Attendance Routes*/
/**
 * @swagger
 * tags:
 *   - name: Attendance
 *     description: Attendance Management APIs
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create attendance
 *     description: Creates attendance manually for an employee.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - attendanceDate
 *               - checkInTime
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *
 *               attendanceDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-02
 *
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T09:05:00
 *
 *     responses:
 *       201:
 *         description: Attendance created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       404:
 *         description: Employee not found
 *
 *       409:
 *         description: Attendance already exists or attendance policy/shift missing
 *
 *       500:
 *         description: Server side error
 */
router.post(
  "/",
  authenticate,
  authorize("attendance.create"),
  attendanceController.createAttendance,
);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendances
 *     description: Retrieves attendance records with optional filters.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         example: 2
 *
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-07-01
 *
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-07-31
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PRESENT
 *             - ABSENT
 *             - HALF_DAY
 *         example: PRESENT
 *
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
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
  authorize("attendance.view"),
  attendanceController.getAttendances,
);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get employee attendance
 *     description: Retrieves attendance details of an employee.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       404:
 *         description: Attendance not found
 *
 *       500:
 *         description: Server side error
 */
router.get(
  "/:id",
  authenticate,
  authorize("attendance.view"),
  attendanceController.getAttendance,
);

/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Employee Check In
 *     description: Records employee check-in for the current attendance date.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - attendanceDate
 *               - checkInTime
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *
 *               attendanceDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-02
 *
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T09:15:00
 *
 *     responses:
 *       201:
 *         description: Checked in successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       404:
 *         description: Employee not found
 *
 *       409:
 *         description: Already checked in, employee on leave, holiday, shift or attendance policy missing
 *
 *       500:
 *         description: Server side error
 */
router.post(
  "/check-in",
  authenticate,
  authorize("attendance.create"),
  attendanceController.checkIn,
);

/**
 * @swagger
 * /attendance/check-out:
 *   patch:
 *     summary: Employee Check Out
 *     description: Records employee check-out and calculates total working hours, overtime, early departure and attendance status.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: Checked out successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Access denied
 *
 *       404:
 *         description: Check-in record not found
 *
 *       409:
 *         description: Employee already checked out
 *
 *       500:
 *         description: Server side error
 */
router.patch(
  "/check-out",
  authenticate,
  authorize("attendance.update"),
  attendanceController.checkOut,
);

module.exports = router;
