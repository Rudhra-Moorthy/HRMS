const express = require('express');

const router = express.Router();

const candidateRoutes = require('./candidate');
const interviewRoutes = require('./interview');
const documentRoutes = require('./document');

router.use('/candidates', candidateRoutes);

router.use('/interviews', interviewRoutes);

router.use('/documents', documentRoutes);

module.exports = router;