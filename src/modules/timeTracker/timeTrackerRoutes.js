const express = require('express');
const router = express.Router();

const timeTrackerController = require('./controller/timeTrackerController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('time-tracker.create'),
    timeTrackerController.createTimeEntry
);

router.get(
    '/',
    authenticate,
    authorize('time-tracker.view'),
    timeTrackerController.getAllTimeEntries
);

router.get(
    '/timesheet/:employeeId',
    authenticate,
    authorize('time-tracker.view'),
    timeTrackerController.getTimesheet
);

router.get(
    '/:id',
    authenticate,
    authorize('time-tracker.view'),
    timeTrackerController.getTimeEntryById
);

router.put(
    '/:id',
    authenticate,
    authorize('time-tracker.update'),
    timeTrackerController.updateTimeEntry
);

router.delete(
    '/:id',
    authenticate,
    authorize('time-tracker.delete'),
    timeTrackerController.deleteTimeEntry
);

module.exports = router;