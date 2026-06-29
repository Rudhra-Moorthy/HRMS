const express = require('express');

const router = express.Router();

const timeTrackerController = require('./controller/timeTrackerController');

router.post('/', timeTrackerController.createTimeEntry);

router.get('/', timeTrackerController.getAllTimeEntries);

router.get('/:id', timeTrackerController.getTimeEntryById);

router.put('/:id', timeTrackerController.updateTimeEntry);

router.delete('/:id', timeTrackerController.deleteTimeEntry);

router.get('/timesheet/:employeeId', timeTrackerController.getTimesheet);

module.exports = router;