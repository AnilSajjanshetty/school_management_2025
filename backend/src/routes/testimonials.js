import express from "express";
import {
  getTestimonials,
  createTestimonial,
  getpublicTestimonials,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.get("/", getTestimonials);
router.get("/public", getpublicTestimonials);
router.post("/", createTestimonial);

export default router;
