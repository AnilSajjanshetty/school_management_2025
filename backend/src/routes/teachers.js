import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { getTeacherDashboard } from "../controllers/teacherDashboardController.js";

const router = express.Router();

router.get("/", getTeachers);
router.post("/", protect, authorize("headmaster"), createTeacher);
router.delete("/:id", protect, authorize("headmaster"), deleteTeacher);
router.get("/dashboard/:userId", getTeacherDashboard);

export default router;
