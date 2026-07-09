const express = require('express');
const router = express.Router();

const timeTrackerController = require('./timeTrackerController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * @swagger
 * tags:
 *   - name: Time Tracker
 *     description: Time Tracking Management APIs
 */

/**
 * @swagger
 * /time-tracker:
 *   post:
 *     summary: Create a time entry
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - projectName
 *               - taskName
 *               - startTime
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               projectName:
 *                 type: string
 *                 example: HRMS
 *               taskName:
 *                 type: string
 *                 example: Employee Module
 *               description:
 *                 type: string
 *                 example: Developed employee CRUD APIs
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-06T09:00:00
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.post(
    '/',
    authenticate,
    authorize('timeTracker.create'),
    timeTrackerController.createTimeEntry
);

/**
 * @swagger
 * /time-tracker:
 *   get:
 *     summary: Get all time entries
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Time entries fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.get(
    '/',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getAllTimeEntries
);

/**
 * @swagger
 * /time-tracker/timesheet/{employeeId}:
 *   get:
 *     summary: Get employee timesheet
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Timesheet fetched successfully
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.get(
    '/timesheet/:employeeId',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getTimesheet
);

/**
 * @swagger
 * /time-tracker/{id}:
 *   get:
 *     summary: Get time entry by ID
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Time entry fetched successfully
 *       404:
 *         description: Time entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.get(
    '/:id',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getTimeEntryById
);

/**
 * @swagger
 * /time-tracker/{id}:
 *   patch:
 *     summary: Update a time entry
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *               taskName:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               totalHours:
 *                 type: number
 *                 example: 7.5
 *     responses:
 *       200:
 *         description: Time entry updated successfully
 *       400:
 *         description: At least one field is required
 *       404:
 *         description: Time entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.patch(
    '/:id',
    authenticate,
    authorize('timeTracker.update'),
    timeTrackerController.updateTimeEntry
);

/**
 * @swagger
 * /time-tracker/{id}:
 *   delete:
 *     summary: Delete a time entry
 *     tags: [Time Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Time entry deleted successfully
 *       404:
 *         description: Time entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server side error
 */
router.delete(
    '/:id',
    authenticate,
    authorize('timeTracker.delete'),
    timeTrackerController.deleteTimeEntry
);

module.exports = router;