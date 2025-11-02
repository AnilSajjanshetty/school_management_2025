import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getAnnouncements,
  createAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", protect, authorize("headmaster"), createAnnouncement);

export default router;
