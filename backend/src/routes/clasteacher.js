//routes/clasteacherRoutes.js
import express from "express";
import {
  getTeacherDashboard,
  getMyClassDetails,
  getTeachingClasses,
  getTeacherTimetable,
  getAnnouncements,
  getEvents,
  getTeacherExams,
} from "../controllers/classTeacherDashboardController.js"; // ← keep the controller file name unchanged
import { authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 *  NOTE: All routes now use "/clasteacher"
 *  Example:
 *      GET /api/clasteacher/dashboard/:userId
 *      GET /api/clasteacher/my-class/:userId
 *      …
 */

// @route   GET /api/clasteacher/dashboard/:userId
router.get("/dashboard/:userId", getTeacherDashboard);

// @route   GET /api/clasteacher/my-class/:userId
router.get(
  "/my-class/:userId",

  getMyClassDetails
);

// @route   GET /api/clasteacher/teaching-classes/:userId
router.get(
  "/teaching-classes/:userId",

  getTeachingClasses
);

// @route   GET /api/clasteacher/timetable/:userId
router.get(
  "/timetable/:userId",

  getTeacherTimetable
);

// @route   GET /api/clasteacher/announcements
router.get(
  "/announcements",

  getAnnouncements
);

// @route   GET /api/clasteacher/events
router.get(
  "/events",

  getEvents
);

// @route   GET /api/clasteacher/exams/:userId
router.get(
  "/exams/:userId",

  getTeacherExams
);

export default router;
