const express = require("express");

const router = express.Router();

const requirementController = require("./controller/requirementController");

const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   - name: Requirements
 *     description: Requirement Management APIs
 */

/**
 * @swagger
 * /requirements:
 *   post:
 *     summary: Create a new requirement
 *     tags:
 *       - Requirements
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
 *               - requirementCode
 *               - position
 *               - departmentId
 *               - vacancies
 *               - experienceRequired
 *               - jobDescription
 *               - priority
 *             properties:
 *               requirementCode:
 *                 type: string
 *                 example: REQ-001
 *
 *               position:
 *                 type: string
 *                 example: Backend Developer
 *
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *
 *               vacancies:
 *                 type: integer
 *                 example: 3
 *
 *               experienceRequired:
 *                 type: string
 *                 example: 3-5 Years
 *
 *               jobDescription:
 *                 type: string
 *                 example: Node.js Developer with PostgreSQL experience.
 *
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: HIGH
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - CLOSED
 *                   - ON_HOLD
 *                 example: OPEN
 *
 *     responses:
 *       201:
 *         description: Requirement created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authenticate,
    authorize("requirement.create"),
    requirementController.createRequirement
);

/**
 * @swagger
 * /requirements:
 *   get:
 *     summary: Get all requirements
 *     tags:
 *       - Requirements
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Requirements fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    authenticate,
    authorize("requirement.view"),
    requirementController.getAllRequirements
);

/**
 * @swagger
 * /requirements/{id}:
 *   get:
 *     summary: Get requirement by ID
 *     tags:
 *       - Requirements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Requirement fetched successfully
 *       404:
 *         description: Requirement not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id",
    authenticate,
    authorize("requirement.view"),
    requirementController.getRequirementById
);

/**
 * @swagger
 * /requirements/{id}:
 *   patch:
 *     summary: Update requirement
 *     tags:
 *       - Requirements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *
 *     responses:
 *       200:
 *         description: Requirement updated successfully
 *       400:
 *         description: At least one field is required
 *       404:
 *         description: Requirement not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:id",
    authenticate,
    authorize("requirement.update"),
    requirementController.updateRequirement
);

/**
 * @swagger
 * /requirements/{id}:
 *   delete:
 *     summary: Delete requirement
 *     tags:
 *       - Requirements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Requirement deleted successfully
 *       404:
 *         description: Requirement not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",
    authenticate,
    authorize("requirement.delete"),
    requirementController.deleteRequirement
);

module.exports = router;