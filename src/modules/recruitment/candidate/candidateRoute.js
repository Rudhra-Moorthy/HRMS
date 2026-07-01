const express = require('express');

const router = express.Router();

const candidateController = require('./controller/candidateController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('candidate.create'),
    candidateController.createCandidate
);

router.get(
    '/',
    authenticate,
    authorize('candidate.view'),
    candidateController.getAllCandidates
);

router.get(
    '/:id',
    authenticate,
    authorize('candidate.view'),
    candidateController.getCandidateById
);

router.patch(
    '/:id',
    authenticate,
    authorize('candidate.update'),
    candidateController.updateCandidate
);

router.delete(
    '/:id',
    authenticate,
    authorize('candidate.delete'),
    candidateController.deleteCandidate
);

module.exports = router;