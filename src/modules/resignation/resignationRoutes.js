const express = require('express');
const router = express.Router();

const resignationController = require('./resignationController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * @swagger
 * tags:
 *   - name: Resignations
 *     description: Employee Resignation Management APIs
 */

/**
 * @swagger
 * /resignations:
 *   post:
 *     summary: Submit resignation
 *     description: Submit a new employee resignation request.
 *     tags:
 *       - Resignations
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
 *               - resignationDate
 *               - lastWorkingDay
 *               - reason
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *
 *               resignationDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-10
 *
 *               lastWorkingDay:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *
 *               reason:
 *                 type: string
 *                 example: Pursuing higher education.
 *
 *               adiitionalDetails:
 *                 type: string
 *                 example: Please provide details about your resignation.
 *
 *     responses:
 *       201:
 *         description: Resignation submitted successfully
 *       400:
 *         description: Required fields are missing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server side error
 */
router.post(
    '/',
    authenticate,
    authorize('resignation.create'),
    resignationController.createResignation
);

/**
 * @swagger
 * /resignations:
 *   get:
 *     summary: Get all resignations
 *     description: Retrieves all resignation requests.
 *     tags:
 *       - Resignations
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Resignations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server side error
 */
router.get(
    '/',
    authenticate,
    authorize('resignation.view'),
    resignationController.getAllResignations
);

/**
 * @swagger
 * /resignations/{id}:
 *   get:
 *     summary: Get resignation by ID
 *     description: Retrieves a resignation request using its ID.
 *     tags:
 *       - Resignations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Resignation ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Resignation retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resignation not found
 *       500:
 *         description: Server side error
 */
router.get(
    '/:id',
    authenticate,
    authorize('resignation.view'),
    resignationController.getResignationById
);

/**
 * @swagger
 * /resignations/{id}:
 *   patch:
 *     summary: Update resignation
 *     description: Updates an existing resignation request.
 *     tags:
 *       - Resignations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Resignation ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *                 example: APPROVED
 *
 *               approvedBy:
 *                 type: integer
 *                 example: 5
 * 
 *               remarks:
 *                 type: string
 *                 example: Approved by HR Manager.
 *
 *     responses:
 *       200:
 *         description: Resignation updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resignation not found
 *       500:
 *         description: Server side error
 */
router.patch(
    '/:id',
    authenticate,
    authorize('resignation.update'),
    resignationController.updateResignation
);

/**
 * @swagger
 * /resignations/{id}:
 *   delete:
 *     summary: Delete resignation
 *     description: Deletes a resignation request.
 *     tags:
 *       - Resignations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Resignation ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Resignation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Resignation not found
 *       500:
 *         description: Server side error
 */
router.delete(
    '/:id',
    authenticate,
    authorize('resignation.delete'),
    resignationController.deleteResignation
);

module.exports = router;