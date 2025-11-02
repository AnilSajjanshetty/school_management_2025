import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getStudents,
  createStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", protect, authorize("headmaster"), createStudent);

export default router;
