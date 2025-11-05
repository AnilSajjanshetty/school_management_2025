import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getAttendance,
  markAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("headmaster", "class_teacher", "teacher", "student"),
  getAttendance
);
router.post("/", protect, authorize("class_teacher","headmaster"), markAttendance);

export default router;
