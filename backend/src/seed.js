// backend/seed.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";

import User from "../src/models/User.js";
import Class from "../src/models/Class.js";
import Teacher from "../src/models/Teacher.js";
import Student from "../src/models/Student.js";
import Announcement from "../src/models/Announcement.js";
import Event from "../src/models/Event.js";
import Testimonial from "../src/models/Testimonial.js";
import Timetable from "../src/models/Timetable.js";
import Attendance from "../src/models/Attendance.js";
import Exam from "../src/models/Exam.js";
import Progress from "../src/models/Progress.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/seed.json"), "utf-8")
);

import bcrypt from "bcryptjs";

const hashPassword = (pwd) => {
  return bcrypt.hashSync(pwd, 10);
};

const seed = async () => {
  try {
    // Clear DB
    await Promise.all([
      User.deleteMany({}),
      Class.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Announcement.deleteMany({}),
      Event.deleteMany({}),
      Testimonial.deleteMany({}),
      Timetable.deleteMany({}),
      Attendance.deleteMany({}),
      Exam.deleteMany({}),
      Progress.deleteMany({}),
    ]);

    // Seed Users
    const users = await User.insertMany(
      seedData.users.map((u) => ({ ...u, password: hashPassword(u.password) }))
    );

    // Seed Teachers
    const teachers = await Teacher.insertMany(seedData.teachers);

    // Seed Classes
    const classes = await Class.insertMany(
      seedData.classes.map((c, i) => ({
        ...c,
        teacherId: teachers[i % teachers.length]._id,
      }))
    );

    // Seed Students
    const students = await Student.insertMany(
      seedData.students.map((s, i) => ({
        ...s,
        classId: classes[i % classes.length]._id,
      }))
    );

    // Seed Announcements, Events, Testimonials
    await Announcement.insertMany(seedData.announcements);
    await Event.insertMany(seedData.events);
    await Testimonial.insertMany(seedData.testimonials);

    // Seed Timetables
    await Timetable.insertMany(
      seedData.timetables.map((t) => ({
        ...t,
        classId: classes[0]._id,
        teacherId: teachers[0]._id,
      }))
    );

    // Seed Attendance
    await Attendance.insertMany(
      seedData.attendance.map((a) => ({
        ...a,
        classId: classes[0]._id,
        studentId: students[0]._id,
      }))
    );

    // Seed Exams
    const exams = await Exam.insertMany(
      seedData.exams.map((e) => ({
        ...e,
        classId: classes[0]._id,
      }))
    );

    // Seed Progress
    await Progress.insertMany(
      seedData.progress.map((p) => ({
        ...p,
        studentId: students[0]._id,
        classId: classes[0]._id,
      }))
    );

    console.log("Mock data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();

// cd backend
//node src/seed.js
