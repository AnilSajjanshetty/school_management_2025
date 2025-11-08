import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import classRoutes from "./routes/classes.js";
import teacherRoutes from "./routes/teachers.js";
import announcementRoutes from "./routes/announcements.js";
import eventRoutes from "./routes/events.js";
import testimonialRoutes from "./routes/testimonials.js";
import studentRoutes from "./routes/students.js";
import timetableRoutes from "./routes/timetables.js";
import attendanceRoutes from "./routes/attendance.js";
import examRoutes from "./routes/exams.js";
import progressRoutes from "./routes/progress.js";
import connectDB from "./config/db.js";
import studentDashboardRoutes from "./routes/studentRoutes.js";
import clasteacherRoutes from "./routes/clasteacher.js";
import contactRoutes from "./routes/contact.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classTeacher", clasteacherRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/contactMessage", contactRoutes);
app.use("/api/students/dashboard", studentDashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
