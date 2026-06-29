const express = require('express');

const router = express.Router();

const resignationController = require('./controller/resignationController');

router.post('/', resignationController.createResignation);

router.get('/', resignationController.getAllResignations);

router.get('/:id', resignationController.getResignationById);

router.put('/:id', resignationController.updateResignation);

router.delete('/:id', resignationController.deleteResignation);

module.exports = router;
