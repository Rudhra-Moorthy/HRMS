const express = require('express');
const router = express.Router();

const controller = require('../controller/resignationController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

/**
 * @swagger
 * tags:
 *   - name: Resignations
 *     description: Employee Resignation Management APIs
 */


/**
 * @swagger
 * /resignations:
 *  post:
 *      summary: Create new resignation for the employee
 *      tags: 
 *          - Resignations
 *      security: 
 *          - bearerAuth: []
 * 
 *      requestBody:
 *          required: true
 *          content:        
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - reasonId
 *                          - resignationDate
 *                          - lastWorkingDay
 *                          - additionalDetails
 * 
 *                      properties:
 *                          reasonId:
 *                              type: integer
 *                              example: 1
 * 
 *                          resignationDate:
 *                              type: string
 *                              format: date
 *                              example: yyyy-mm-dd
 * 
 *                          lastWorkingDay:
 *                              type: string
 *                              format: date
 *                              example: yyyy-mm-dd
 * 
 *                          additionalDetails:
 *                              type: string
 *                              example: Provide additional reason for your resignation
 * 
 *      responses:
 *          200:
 *              description: Resignation has been submitted successfully
 * 
 *          400:
 *              description: Employee is Inactive / Invalid resignation reason / Reporting manager has not configured Last Working day cannot be before resignation date
 * 
 *          401:
 *              description: Unauthorized
 * 
 *          403:
 *              description: Access Denied
 * 
 *          404:
 *              description: Employee has not found
 * 
 *          409: 
 *              description: Pending resignation already exists
 * 
 *          500:
 *              description: Server side error
 *          
 */
router.post('/', authenticate, authorize('resignation.create'), controller.createResignation);

/**
 * @swagger
 * /resignations/my-resignation:
 *  get:
 *      summary: Get Employee's resignation
 *      tags:
 *          - Resignations
 *      security:
 *          - bearerAuth: []
 * 
 *      responses:
 *          200:
 *              description: Resignation has been retrieved successfully
 * 
 *          404:
 *              description: Resignation of the employees has not found.
 * 
 *          401:
 *              description: Unauthorized
 * 
 *          403:
 *              description: Access denied
 * 
 *          500:
 *              description: Server side error
 */
router.get('/my-regination', authenticate, authorize('resignation.view'), controller.getMyResignation);

router.get('/pending', authenticate, authorize('resignation.view'), controller.getPendingResignations);

router.get('/:id', authenticate, authorize('resignation.view'), controller);

router.patch('/:id/approve', authenticate, authorize('resignation.approve'), controller.approveResignation);

router.patch('/:id/reject', authenticate, authorize('resignation.reject'), controller.rejectResignation);

router.get('/hr/pending', authenticate, authorize('resignation.hr.view'), controller.getHrPendingResignations);

router.patch('/hr/:id/approve', authenticate, authorize('resignation.hr.approve'), controller.hrApproveResignation);

router.patch('/hr/:id/reject', authenticate, authorize('resignation.hr.reject'), controller.rejectResignation);

module.exports = router;