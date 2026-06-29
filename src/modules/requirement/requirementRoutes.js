const express = require('express');

const router = express.Router();

const requirementController = require('./controller/requirementController');


router.post('/', requirementController.createRequirement);

router.get('/', requirementController.getAllRequirements);

router.get('/:id', requirementController.getRequirementById);

router.put('/:id', requirementController.updateRequirement);

router.delete('/:id', requirementController.deleteRequirement);


module.exports = router;