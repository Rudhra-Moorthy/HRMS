const express = require("express");
const router = express.Router();
const controller = require("../controller/attendanceRegularizationController");
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");
const validation = require("../middleware/attendanceRegularizationValidation");

/* Attendance Regularisations */
router.post(
  "/",
  authenticate,
  authorize("regularization.create"),
  validation.validateCreate,
  controller.createRegularization,
);

router.get(
  "/",
  authenticate,
  authorize("regularization.view"),
  controller.getRegularizations,
);

router.get(
  "/:id",
  authenticate,
  authorize("regularization.view"),
  controller.getRegularization,
);

router.patch(
  "/:id",
  authenticate,
  authorize("regularization.update"),
  validation.validateUpdate,
  controller.updateRegularization,
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize("attendance.regularization.approve"),
  controller.approveRegularization,
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize("attendance.regularization.reject"),
  controller.rejectRegularization
);

module.exports = router;
