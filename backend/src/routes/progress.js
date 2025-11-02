import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getProgress,
  createProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("headmaster", "class_teacher", "teacher", "student"),
  getProgress
);
router.post("/", protect, authorize("teacher"), createProgress);

export default router;
