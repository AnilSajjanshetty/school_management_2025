// routes/studentRoutes.js
import express from "express";
import { getStudentDashboard } from "../controllers/studentDashboardController.js";

const router = express.Router();

router.get("/:userId", getStudentDashboard);
// ... other routes

export default router;
