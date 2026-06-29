const express = require('express');

const router = express.Router();

const attendance1Routes = require('./attendance');
const regularizationRoutes = require('./regularization');

router.use('/', attendance1Routes);

router.use('/regularization', regularizationRoutes);

module.exports = router;