import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getClasses,
  createClass,
  deleteClass,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/", getClasses);
router.post("/", protect, authorize("headmaster"), createClass);
router.delete("/:id", protect, authorize("headmaster"), deleteClass);

export default router;
