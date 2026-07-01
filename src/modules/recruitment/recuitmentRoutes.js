const express = require('express');

const router = express.Router();

const candidateRoutes = require('./candidate/candidateRoutes');
const interviewRoutes = require('./interview/interviewRoutes');
const documentRoutes = require('./document/documentRoutes');

router.use('/candidates', candidateRoutes);

router.use('/interviews', interviewRoutes);

router.use('/documents', documentRoutes);

module.exports = router;