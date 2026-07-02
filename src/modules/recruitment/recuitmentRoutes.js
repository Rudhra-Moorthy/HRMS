const express = require('express');

const router = express.Router();

const candidateRoutes = require('./candidate/candidateRoutes');
const interviewRoutes = require('./interview/interviewRoutes');
const candidateDocumentRoutes = require('./candidateDocument/candidateDocumentRoutes');

/**
 * @swagger
 * tags:
 *  - name: Recruitments
 *    description: Recruitment Management APIs
 */

router.use('/candidates', candidateRoutes);

router.use('/interviews', interviewRoutes);

router.use('/documents', candidateDocumentRoutes);

module.exports = router;