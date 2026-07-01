const express = require('express');
const router = express.Router();

const requirementController = require('./controller/requirementController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('requirement.create'),
    requirementController.createRequirement
);

router.get(
    '/',
    authenticate,
    authorize('requirement.view'),
    requirementController.getAllRequirements
);

router.get(
    '/:id',
    authenticate,
    authorize('requirement.view'),
    requirementController.getRequirementById
);

router.patch(
    '/:id',
    authenticate,
    authorize('requirement.update'),
    requirementController.updateRequirement
);

router.delete(
    '/:id',
    authenticate,
    authorize('requirement.delete'),
    requirementController.deleteRequirement
);

module.exports = router;