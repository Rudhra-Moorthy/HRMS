const express = require('express');

const router = express.Router();

const candidateRoutes = require('./candidate/candidateRoute');
const interviewRoutes = require('./interview/interviewRoutes.js.js');
const documentRoutes = require('./document/documentRoutes.js');

router.use('/candidates', candidateRoutes);

router.use('/interviews', interviewRoutes);

router.use('/documents', documentRoutes);

module.exports = router;