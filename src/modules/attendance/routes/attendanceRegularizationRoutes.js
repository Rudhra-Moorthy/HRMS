const express = require("express");
const router = express.Router();
const controller = require("../controller/attendanceRegularizationController");
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");
const validation = require("../middleware/attendanceRegularizationValidation");

/* Attendance Regularisations */

/**
 * @swagger
 * tags:
 *   - name: Attendance Regularizations
 *     description: Attendance Regularization Management APIs
 */

/**
 * @swagger
 * /attendance-regularizations:
 *   post:
 *     summary: Create attendance regularization request
 *     description: Employee submits an attendance regularization request.
 *     tags:
 *       - Attendance Regularizations
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
 *               - attendanceId
 *               - requestType
 *               - reason
 *             properties:
 *               attendanceId:
 *                 type: integer
 *                 example: 101
 *
 *               requestType:
 *                 type: string
 *                 enum:
 *                   - CHECK_IN
 *                   - CHECK_OUT
 *                   - BOTH
 *                 example: BOTH
 *
 *               requestedCheckIn:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T09:10:00
 *
 *               requestedCheckOut:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T18:20:00
 *
 *               reason:
 *                 type: string
 *                 example: Forgot to check in due to network issue.
 *
 *     responses:
 *       201:
 *         description: Attendance regularization submitted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to regularize this attendance
 *       404:
 *         description: Attendance record not found
 *       409:
 *         description: Regularization request already pending
 *       500:
 *         description: Server side error
 */
router.post(
  "/",
  authenticate,
  authorize("regularization.create"),
  validation.validateCreate,
  controller.createRegularization,
);

/**
 * @swagger
 * /attendance-regularizations:
 *   get:
 *     summary: Get attendance regularizations
 *     description: Retrieves attendance regularization requests.
 *     tags:
 *       - Attendance Regularizations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         example: 10
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *         example: PENDING
 *
 *     responses:
 *       200:
 *         description: Attendance regularizations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server side error
 */
router.get(
  "/",
  authenticate,
  authorize("regularization.view"),
  controller.getRegularizations,
);

/**
 * @swagger
 * /attendance-regularizations/{id}:
 *   get:
 *     summary: Get attendance regularization by ID
 *     description: Retrieves a specific attendance regularization request.
 *     tags:
 *       - Attendance Regularizations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Regularization ID
 *         schema:
 *           type: integer
 *         example: 5
 *
 *     responses:
 *       200:
 *         description: Attendance regularization retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Attendance regularization not found
 *       500:
 *         description: Server side error
 */
router.get(
  "/:id",
  authenticate,
  authorize("regularization.view"),
  controller.getRegularization,
);

/**
 * @swagger
 * /attendance-regularizations/{id}:
 *   patch:
 *     summary: Update attendance regularization
 *     description: Updates a pending attendance regularization request.
 *     tags:
 *       - Attendance Regularizations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *                 enum:
 *                   - CHECK_IN
 *                   - CHECK_OUT
 *                   - BOTH
 *                 example: BOTH
 *
 *               requestedCheckIn:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T09:05:00
 *
 *               requestedCheckOut:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-02T18:10:00
 *
 *               reason:
 *                 type: string
 *                 example: Updating requested timings.
 *
 *     responses:
 *       200:
 *         description: Attendance regularization updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You cannot update this request
 *       404:
 *         description: Attendance regularization not found
 *       409:
 *         description: Only pending requests can be updated
 *       500:
 *         description: Server side error
 */
router.patch(
  "/:id",
  authenticate,
  authorize("regularization.update"),
  validation.validateUpdate,
  controller.updateRegularization,
);

/**
 * @swagger
 * /attendance-regularizations/{id}/approve:
 *   patch:
 *     summary: Approve attendance regularization
 *     description: Reporting manager approves a pending attendance regularization request.
 *     tags:
 *       - Attendance Regularizations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Regularization ID
 *         schema:
 *           type: integer
 *         example: 5
 *
 *     responses:
 *       200:
 *         description: Attendance regularization approved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not authorized to approve this request
 *       404:
 *         description: Attendance regularization not found
 *       409:
 *         description: Request has already been processed
 *       500:
 *         description: Server side error
 */
router.patch(
  "/:id/approve",
  authenticate,
  authorize("attendance.regularization.approve"),
  controller.approveRegularization,
);

/**
 * @swagger
 * /attendance-regularizations/{id}/reject:
 *   patch:
 *     summary: Reject attendance regularization
 *     description: Reporting manager rejects a pending attendance regularization request.
 *     tags:
 *       - Attendance Regularizations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Regularization ID
 *         schema:
 *           type: integer
 *         example: 5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Insufficient supporting evidence.
 *
 *     responses:
 *       200:
 *         description: Attendance regularization rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not authorized to reject this request
 *       404:
 *         description: Attendance regularization not found
 *       409:
 *         description: Request has already been processed
 *       500:
 *         description: Server side error
 */
router.patch(
  "/:id/reject",
  authenticate,
  authorize("attendance.regularization.reject"),
  controller.rejectRegularization,
);

module.exports = router;
