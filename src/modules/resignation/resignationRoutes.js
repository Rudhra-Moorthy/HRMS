const express = require('express');
const router = express.Router();

const resignationController = require('./controller/resignationController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('resignation.create'),
    resignationController.createResignation
);

router.get(
    '/',
    authenticate,
    authorize('resignation.view'),
    resignationController.getAllResignations
);

router.get(
    '/:id',
    authenticate,
    authorize('resignation.view'),
    resignationController.getResignationById
);

router.patch(
    '/:id',
    authenticate,
    authorize('resignation.update'),
    resignationController.updateResignation
);

router.delete(
    '/:id',
    authenticate,
    authorize('resignation.delete'),
    resignationController.deleteResignation
);

module.exports = router;