const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');
const requirementRoutes = require('./requirement');
const recruitmentRoutes = require('./recruitment');

router.use('/auth', authRoutes);

router.use('/employees', employeeRoutes);

router.use('/requirements', requirementRoutes);

router.use('/recruitment', recruitmentRoutes);

module.exports = router;