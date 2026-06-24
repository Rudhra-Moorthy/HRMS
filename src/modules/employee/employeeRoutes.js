const express = require('express');
const router = express.Router();
const employeeController = require('./controller/employeeController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');


router.post('/', authenticate, authorize('employee.create'), employeeController.createEmployee);
router.get('/', authenticate, authorize('employee.view'), employeeController.getEmployees);
router.get('/:id', authenticate, authorize('employee.view'), employeeController.getEmployee);
router.patch('/:id', authenticate, authorize('employee.update'), employeeController.updateEmployee);
router.delete('/:id', authenticate, authorize('employee.delete'), employeeController.deleteEmployee);


module.exports = router;