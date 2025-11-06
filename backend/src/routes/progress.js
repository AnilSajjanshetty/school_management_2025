import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getAllProgress,
  createProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/", getAllProgress);
router.post("/", protect, authorize("teacher"), createProgress);

export default router;
