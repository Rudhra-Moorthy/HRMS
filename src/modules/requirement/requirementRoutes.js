const express = require('express');
const router = express.Router();

const requirementController = require('./controller/requirementController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * @swagger
 * tags:
 *  name: Requirements
 *  description: Requirement Management APIs
 */

/**
 * @swagger
 * /requirements:
 *   post:
 *      summary: Create a new requirement
 *      description: Creates a new recruitment requirement
 *      tags: [Requirements]
 * 
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
 *                          - requirementCode
 *                          - position
 *                          - departmentId
 *                          - vacancies
 *                          - jobDescription
 *                          - priority
 *                      properties:
 *                          requirementCode:
 *                              type: string
 *                              example: REQ-001
 * 
 *                          position:
 *                              type: string
 *                              example: Senior Full Stack Developer
 * 
 *                          departmentId:
 *                              type: integer
 *                              example: 1
 * 
 *                          vacancies: 
 *                              type: integer
 *                              example: 2
 * 
 *                          experienceRequired:
 *                              type: string
 *                              example: 3-5 years
 * 
 *                          jobDescription:
 *                              type: string
 *                              example: Design, develop and maintain enterprise applications
 * 
 *                          priority:
 *                              type: string
 *                              enum:
 *                                  - HIGH
 *                                  - LOW
 *                                  - MEDIUM
 *                              example: HIGH
 * 
 *      responses: 
 *          201:
 *              description: Requirement has been created successfully
 * 
 *          400:
 *              description: Validation error
 * 
 *          401: 
 *              description: Unauthorized
 *          
 *          403: 
 *              description: Forbidden
 *           
 *          500: 
 *              description: Server side error
 *                          
 */
router.post(
    '/',
    authenticate,
    authorize('requirement.create'),
    requirementController.createRequirement
);

/**
 * @swagger
 * /requirements:
 *   get:
 *      summary: Gets all requirements
 *      description: Retrieves all the requirements
 *      tags: [Requirements]
 * 
 *      security:
 *          - bearerAuth: []
 * 
 *      responses:
 *          200: 
 *              description: Requirements has been fetched successfully
 * 
 *          401:
 *              description: Unauthorized
 *  
 *          403:
 *              description: Forbidden
 *          
 *          500:
 *              description: Server side error
 * 
 */
router.get(
    '/',
    authenticate,
    authorize('requirement.view'),
    requirementController.getAllRequirements
);

/**
 * @swagger
 * /requirements/{id}:
 *   get:
 *      summary: Gets all requirements
 *      description: Retrieves all the requirements
 *      tags: [Requirements]
 * 
 *      security:
 *          - bearerAuth: []
 * 
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema: 
 *              type: integer
 *            example: 1
 * 
 *      responses:
 *          200: 
 *              description: Requirements has been fetched successfully
 * 
 *          401:
 *              description: Unauthorized
 *  
 *          403:
 *              description: Forbidden
 * 
 *          404: 
 *              description: Requirement not found
 *          
 *          500:
 *              description: Server side error
 * 
 */
router.get(
    '/:id',
    authenticate,
    authorize('requirement.view'),
    requirementController.getRequirementById
);

/**
 * @swagger
 * /requirements/{id}:
 *   patch:
 *      summary: Updates a requirement
 *      description: Updates the requirement as per the data
 *      tags: [Requirements]
 * 
 *      security:
 *          - bearerAuth: []
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            required: true
 *            schema:      
 *              type: integer
 *            example: 1
 * 
 *      requestBody:
 *         required: true
 *         content:
 *                  application/json:
 *                      schema:
 *                          type: object
 * 
 *                          properties:
 * 
 *                              position:
 *                                  type: string
 *                                  example: Senior Full Stack Developer
 * 
 *                              departmentId:
 *                                  type: integer
 *                                  example: 1
 * 
 *                              vacancies: 
 *                                  type: integer
 *                                  example: 2
 * 
 *                              experienceRequired:
 *                                  type: string
 *                                  example: 3-5 years
 * 
 *                              jobDescription:
 *                                  type: string
 *                                  example: Design, develop and maintain enterprise applications
 * 
 *                              priority:
 *                                  type: string
 *                                  enum:
 *                                      - HIGH
 *                                      - LOW
 *                                      - MEDIUM
 *                                  example: HIGH
 *                              
 *            
 *      responses:
 *          200: 
 *              description: Requirements has been updated successfully
 * 
 *          400:
 *              description: Atleast one field is required
 * 
 *          404:
 *              description: Requirement has not found.
 * 
 *          401:
 *              description: Unauthorized
 *  
 *          403:
 *              description: Forbidden
 *          
 *          500:
 *              description: Server side error
 * 
 */
router.patch(
    '/:id',
    authenticate,
    authorize('requirement.update'),
    requirementController.updateRequirement
);

/**
 * @swagger
 * /requirements/{id}:
 *   delete:
 *      summary: Delete requirement
 *      description: Deletes a requirement
 *      tags: [Requirements]
 *
 *      security:
 *          - bearerAuth: []
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            example: 1
 *
 *      responses:
 *          200:
 *              description: Requirement has been deleted successfully
 *          404:
 *              description: Requirement has not found
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Permission denied
 *          500:
 *              description: Server side error
 */
router.delete(
    '/:id',
    authenticate,
    authorize('requirement.delete'),
    requirementController.deleteRequirement
);

module.exports = router;