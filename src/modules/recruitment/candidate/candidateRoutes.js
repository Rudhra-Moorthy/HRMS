const express = require("express");

const router = express.Router();

const candidateController = require("./candidateController");

const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");

/**
 * @swagger
 * /recruitments/candidates:
 *  post:
 *      summary: Create a new candidate
 *      tags:
 *          - Recruitments
 *      security:
 *          - bearerAuth: []
 *
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *
 *                      required:
 *                          - fullName
 *                          - email
 *                          - requirementId
 *                          - phoneNumber
 *
 *                      properties:
 *                          fullName:
 *                              type: string
 *                              example: John Doe
 *
 *                          email:
 *                              type: string
 *                              example: johndoe@gmail.com
 *
 *                          phoneNumber:
 *                              type: string
 *                              example: +91 78578 98084
 *
 *                          requirementId:
 *                              type: integer
 *                              example: 1
 *
 *                          experience:
 *                              type: string
 *                              example: 5
 *
 *                          status:
 *                              type: string
 *                              enum:
 *                                  - Applied
 *                                  - Screening
 *                                  - Interview
 *                              example: Applied
 *
 *      responses:
 *          201:
 *              description: Candidate has been created successfully
 *
 *          400:
 *              description: Validation Error
 *
 *          401:
 *              description: Unauthorized
 *
 *          403:
 *              description: Access denied
 *
 *          500:
 *              description: Server side error
 *
 */
router.post(
  "/",
  authenticate,
  authorize("candidate.create"),
  candidateController.createCandidate,
);

/**
 * @swagger
 * /recruitments/candidates:
 *  get:
 *      summary: Get all candidates
 *      tags:
 *          - Recruitments
 *      security:
 *          - bearerAuth: []
 *
 *      responses:
 *          200:
 *              description: Candidates have been fetched successfully
 *
 *          401:
 *              description: Unauthorized
 *
 *          403:
 *              description: Access Denied
 *
 *          500:
 *              description: Server side error
 *
 */
router.get(
  "/",
  authenticate,
  authorize("candidate.view"),
  candidateController.getAllCandidates,
);

/**
 * @swagger
 * /recruitments/candidates/{id}:
 *  get:
 *      summary: Get all candidates
 *      tags: 
 *        - Recruitments
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
 *              description: Candidates have been fetched successfully
 *
 *          401:
 *              description: Unauthorized
 *
 *          403:
 *              description: Access Denied
 *
 *          404:
 *              decription: Candidate has not found.
 *
 *          500:
 *              description: Server side error
 *
 */
router.get(
  "/:id",
  authenticate,
  authorize("candidate.view"),
  candidateController.getCandidateById,
);

router.patch(
  "/:id",
  authenticate,
  authorize("candidate.update"),
  candidateController.updateCandidate,
);

router.delete(
  "/:id",
  authenticate,
  authorize("candidate.delete"),
  candidateController.deleteCandidate,
);

module.exports = router;
