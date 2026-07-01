const express = require('express');
const router = express.Router();

const timeTrackerController = require('./controller/timeTrackerController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('timeTracker.create'),
    timeTrackerController.createTimeEntry
);

router.get(
    '/',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getAllTimeEntries
);

router.get(
    '/timesheet/:employeeId',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getTimesheet
);

router.get(
    '/:id',
    authenticate,
    authorize('timeTracker.view'),
    timeTrackerController.getTimeEntryById
);

router.put(
    '/:id',
    authenticate,
    authorize('timeTracker.update'),
    timeTrackerController.updateTimeEntry
);

router.delete(
    '/:id',
    authenticate,
    authorize('timeTracker.delete'),
    timeTrackerController.deleteTimeEntry
);

module.exports = router;