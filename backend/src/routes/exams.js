import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getExams,
  createExam,
  addResults,
} from "../controllers/examController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("headmaster", "class_teacher", "teacher", "student"),
  getExams
);
router.post("/", protect, authorize("headmaster", "teacher"), createExam);
router.post("/:id/results", protect, authorize("teacher"), addResults);

export default router;
