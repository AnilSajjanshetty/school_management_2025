import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getTeachers);
router.post("/", protect, authorize("headmaster"), createTeacher);
router.delete("/:id", protect, authorize("headmaster"), deleteTeacher);

export default router;
