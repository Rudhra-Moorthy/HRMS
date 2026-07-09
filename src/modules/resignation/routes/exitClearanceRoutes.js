const express = require('express');
const router = express.Router();

const controller = require('../controller/exitClearanceController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

router.get('/', authenticate, authorize('exit.clearance.view'), controller.getExitClearances);
router.get('/:id', authenticate, authorize('exit.clearance.view'), controller.getExitClearance);

router.get('/my', authenticate, controller.getMyExitClearance);

/* Department approver */
router.get('/tasks/pending', authenticate, controller.getPendingTasks);

router.get('/tasks/:taskId', authenticate, controller.getTask);

router.patch('/tasks/:taskId/approve', authenticate, authorize('exit.clearance.approve'), controller.approveTask);

router.patch('/tasks/:taskId/reject', authenticate, authorize('exit.clearance.reject'), controller.rejectTask);

router.patch('/:clearanceId/complete', authenticate, authorize('exit.clearance.complete'), controller.completeExitClearance);


module.exports = router;