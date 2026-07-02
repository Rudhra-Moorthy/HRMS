const express = require("express");
const router = express.Router();
const employeeController = require("./controller/employeeController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

/**
 * @swagger
 * tags:
 *      - name: Employees
 *        descripton: Employee Management APIs
 */

/**
 * @swagger
 * /employees:
 *  post:
 *      summary: Create new employee
 *      tags:
 *          - Employees
 *      security:
 *          - bearerAuth: []
 *
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 * 
 *                          employeeCode: 
 *                              type: string
 *                              example: EMP-001
 * 
 *                          fullName:
 *                              type: string
 *                              example: John Doe
 * 
 *                          email:
 *                              type: string
 *                              example: johndoe@gmail.com
 * 
 *                          phone:
 *                              type: string
 *                              example: 8958938494
 * 
 *                          departmentId:
 *                              type: integer
 *                              example: 1
 * 
 *                          designationId:
 *                              type: integer
 *                              example: 1
 * 
 *                          employmentCategoryId:
 *                              type: integer
 *                              example: 1
 * 
 *                          joinDate:
 *                              type: string
 *                              example: yyyy-mm-dd
 * 
 *                          salary:
 *                              type: number
 *                              format: decimal
 *                              example: 13394.43
 * 
 *                          address:
 *                              type: object
 *                              properties:
 *                                  addressLine1:
 *                                      type: string
 *                                  addressLine2:
 *                                      type: string
 *                                  city: 
 *                                      type: string
 *                                  state: 
 *                                      type: string
 *                                  country:
 *                                      type: string
 *                                  postalCode:
 *                                      type: string
 *                              
 *                          salaryStructure:
 *                              type: object
 *                              properties:
 *                                  basicPay:
 *                                      type: number
 *                                      format: decimal
 *                                  hra:
 *                                      type: number
 *                                      format: decimal
 *                                  medical:
 *                                      type: number
 *                                      format: decimal
 *                                  conveyance:
 *                                      type: number
 *                                      format: decimal
 *                                  specialAllowance:
 *                                      type: number
 *                                      format: decimal
 *                                  advanceBonus:
 *                                      type: number
 *                                      format: decimal
 *                                  companyPf:
 *                                      type: number
 *                                      format: decimal
 *                                  aplc:
 *                                      type: number
 *                                      format: decimal
 *                                  employeePf:
 *                                      type: number
 *                                      format: decimal
 *                                  esi:
 *                                      type: number
 *                                      format: decimal
 *                                  professionalTax:
 *                                      type: number
 *                                      format: decimal           
 * 
 *      responses:
 *          201:
 *              description: Employee has been created successfully
 *          400:
 *              description: Something went wrong in the process
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Access denied
 *          409:
 *              description: Already registered
 *          500:
 *              description: Server side erro
 *
 */
router.post(
  "/",
  authenticate,
  authorize("employee.create"),
  employeeController.createEmployee,
);

/**
 * @swagger
 * /employees:
 *  get:
 *      summary: Get all employees
 *      description: Retrieves all employees from the company
 *      tags: 
 *          - Employees
 *      security:
 *          - bearerAuth: []
 * 
 *      responses:
 *          200:
 *              description: Employees data have been retrieved successfully
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
router.get(
  "/",
  authenticate,
  authorize("employee.view"),
  employeeController.getEmployees,
);

/**
 * @swagger
 * /employees/{id}:
 *  get:
 *      summary: Get Employee by id
 *      description: Retrieves a single employee using the employeeId
 *      tags: 
 *          - Employees
 *      securtiy:
 *          - bearerAuth: []
 * 
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: EmployeeId
 *            schema:
 *              type: integer
 *            example: 1
 * 
 *      responses:
 *          200:
 *              description: Employee retrieved successfully
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Access denied
 *          404:
 *              description: Employee not found
 *          500:
 *              description: Server side error
 */
router.get(
  "/:id",
  authenticate,
  authorize("employee.view"),
  employeeController.getEmployee,
);

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update employee
 *     description: Updates an existing employee.
 *     tags:
 *       - Employees
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *
 *               departmentId:
 *                 type: integer
 *                 example: 2
 *
 *               designationId:
 *                 type: integer
 *                 example: 3
 *
 *               employmentCategoryId:
 *                 type: integer
 *                 example: 1
 *
 *               joinDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-30
 *
 *               salary:
 *                 type: number
 *                 format: decimal
 *                 example: 45000
 *
 *               address:
 *                 type: object
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                   addressLine2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *
 *               salaryStructure:
 *                 type: object
 *                 properties:
 *                   basicPay:
 *                     type: number
 *                   hra:
 *                     type: number
 *                   medical:
 *                     type: number
 *                   conveyance:
 *                     type: number
 *                   specialAllowance:
 *                     type: number
 *                   advanceBonus:
 *                     type: number
 *                   companyPf:
 *                     type: number
 *                   aplc:
 *                     type: number
 *                   employeePf:
 *                     type: number
 *                   esi:
 *                     type: number
 *                   professionalTax:
 *                     type: number
 *
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server side error
 */
router.patch(
  "/:id",
  authenticate,
  authorize("employee.update"),
  employeeController.updateEmployee,
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     description: Deletes an employee from the system.
 *     tags:
 *       - Employees
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
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server side error
 */
router.delete(
  "/:id",
  authenticate,
  authorize("employee.delete"),
  employeeController.deleteEmployee,
);

module.exports = router;
