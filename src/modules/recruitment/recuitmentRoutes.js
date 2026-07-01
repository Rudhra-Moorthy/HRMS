const express = require('express');

const router = express.Router();

const candidateRoutes = require('./candidate/candidateRoute');
const interviewRoutes = require('./interview/interviewRoutes');
const candidateDocumentRoutes = require('./candidateDocument/candidateDocumentRoutes');

router.use('/candidates', candidateRoutes);

router.use('/interviews', interviewRoutes);

router.use('/documents', candidateDocumentRoutes);

module.exports = router;