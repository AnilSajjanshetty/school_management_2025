// routes/contact.js
import express from "express";
import {
  createContactMessage,
  getContactMessages,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Anyone can send (guest or logged in)
router.post("/", createContactMessage);

// Protected: Students, Teachers, Parents, Admins
router.get("/", getContactMessages);

export default router;
