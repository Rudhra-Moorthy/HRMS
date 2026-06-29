const express = require('express');

const router = express.Router();

const attendanceRegularizationController = require('./controller/attendanceRegularizationController');

router.post('/',attendanceRegularizationController.createRequest);

router.get('/',attendanceRegularizationController.getAllRequests);

router.get('/:id',attendanceRegularizationController.getRequestById);

router.put('/approve/:id',attendanceRegularizationController.approveRequest);

router.put('/reject/:id',attendanceRegularizationController.rejectRequest);

module.exports = router;