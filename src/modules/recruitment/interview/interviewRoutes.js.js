const express = require('express');

const router = express.Router();

const interviewController = require('./controller/interviewController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('interview.create'),
    interviewController.createInterview
);

router.get(
    '/',
    authenticate,
    authorize('interview.view'),
    interviewController.getAllInterviews
);

router.get(
    '/:id',
    authenticate,
    authorize('interview.view'),
    interviewController.getInterviewById
);

router.patch(
    '/:id',
    authenticate,
    authorize('interview.update'),
    interviewController.updateInterview
);

router.delete(
    '/:id',
    authenticate,
    authorize('interview.delete'),
    interviewController.deleteInterview
);

module.exports = router;