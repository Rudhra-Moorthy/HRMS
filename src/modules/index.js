const express = require('express');
const router = express.Router();

// Import the module routes
const authRoutes = require('./auth/authRoutes');
const employeeRoutes = require('./employee/employeeRoutes');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;