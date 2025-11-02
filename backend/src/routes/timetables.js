import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getTimetables,
  createTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", getTimetables);
router.post("/", protect, authorize("headmaster"), createTimetable);

export default router;
