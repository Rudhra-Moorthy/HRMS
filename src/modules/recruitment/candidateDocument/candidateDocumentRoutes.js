const express = require("express");

const router = express.Router();

const documentController = require("./candidateDocumentController");

const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");

/**
 * @swagger
 * /recruitments/candidate-documents:
 *   post:
 *     summary: Upload Candidate Document
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateId
 *               - documentType
 *               - fileUrl
 *             properties:
 *               candidateId:
 *                 type: integer
 *                 example: 1
 *               documentName:
 *                 type: string
 *                 example: Resume
 *               documentType:
 *                 type: string
 *                 example: PDF
 *               fileUrl:
 *                 type: string
 *                 example: https://example.com/resume.pdf
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post(
    "/",
    authenticate,
    authorize("candidateDocument.create"),
    documentController.createDocument
);

/**
 * @swagger
 * /recruitments/candidate-documents:
 *   get:
 *     summary: Get All Candidate Documents
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents fetched successfully
 */
router.get(
    "/",
    authenticate,
    authorize("candidateDocument.view"),
    documentController.getAllDocuments
);

/**
 * @swagger
 * /recruitments/candidate-documents/{id}:
 *   get:
 *     summary: Get Candidate Document By Id
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       404:
 *         description: Document not found
 */
router.get(
    "/:id",
    authenticate,
    authorize("candidateDocument.view"),
    documentController.getDocumentById
);

/**
 * @swagger
 * /recruitments/candidate-documents/candidate/{candidateId}:
 *   get:
 *     summary: Get Documents By Candidate Id
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Documents fetched successfully
 */
router.get(
    "/candidate/:candidateId",
    authenticate,
    authorize("candidateDocument.view"),
    documentController.getDocumentsByCandidateId
);

/**
 * @swagger
 * /recruitments/candidate-documents/{id}:
 *   patch:
 *     summary: Update Candidate Document
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document updated successfully
 */
router.patch(
    "/:id",
    authenticate,
    authorize("candidateDocument.update"),
    documentController.updateDocument
);

/**
 * @swagger
 * /recruitments/candidate-documents/{id}:
 *   delete:
 *     summary: Delete Candidate Document
 *     tags:
 *       - Recruitments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document deleted successfully
 */
router.delete(
    "/:id",
    authenticate,
    authorize("candidateDocument.delete"),
    documentController.deleteDocument
);

module.exports = router;