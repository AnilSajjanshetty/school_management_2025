import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getTimetables,
  createTimetable,
  getAllClassTimetables,
} from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", getTimetables);
router.get("/all-classes", getAllClassTimetables);
router.post("/", protect, authorize("headmaster"), createTimetable);

export default router;
