const express = require("express");
const router = express.Router();

const controller = require("../controller/attendanceRegularizationHistoryController");
const { validateHistory } = require("../middleware/attendanceRegularizationHistoryValidation");
const authenicate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");

/* History */
router.post(
  "/",
  authenicate,
  authorize("attendance.regularization.history.create"),
  validateHistory,
  controller.createHistory,
);

router.get(
  "/:regularizationId",
  authenicate,
  authorize("attendance.regularization.history.view"),
  validateHistory,
  controller.getHistory,
);

module.exports = router;
