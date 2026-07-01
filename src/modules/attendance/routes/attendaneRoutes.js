const express = require("express");
const router = express.Router();
const authenticate = require("../../../middlewares/authenticate");
const authorize = require("../../../middlewares/authorize");
const attendanceController = require("../controller/attendanceController");

/* Attendance Routes*/
router.post(
  "/",
  authenticate,
  authorize("attendance.create"),
  attendanceController.createAttendance,
);

router.get(
  "/",
  authenticate,
  authorize("attendance.view"),
  attendanceController.getAttendances,
);

router.get(
  "/:id",
  authenticate,
  authorize("attendance.view"),
  attendanceController.getAttendance,
);

router.post(
  "/check-in",
  authenticate,
  authorize("attendance.create"),
  attendanceController.checkIn,
);

router.patch(
  "/check-out",
  authenticate,
  authorize("attendance.update"),
  attendanceController.checkOut,
);

module.exports = router;
