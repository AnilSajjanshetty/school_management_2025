import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";

// Models
import User from "./models/User.js";
import Teacher from "./models/Teacher.js";
import Class from "./models/Class.js";
import Student from "./models/Student.js";
import Subject from "./models/Subject.js";
import Timetable from "./models/Timetable.js";
import Attendance from "./models/Attendance.js";
import Exam from "./models/Exam.js";
import Progress from "./models/Progress.js";
import Event from "./models/Event.js";
import Announcement from "./models/Announcement.js";
import Testimonial from "./models/Testimonial.js";
import ContactMessage from "./models/ContactMessage.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let seedData;
try {
  seedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "seed.json"), "utf-8")
  );
} catch (err) {
  console.error("Failed to read seed.json:", err.message);
  process.exit(1);
}

process.env.NODE_ENV = "seeding";

// Helper
const hashPassword = (pwd) => bcrypt.hashSync(pwd || "password123", 10);

// Maps
const userMap = {}; // email or _id → user._id
const teacherMap = {}; // userId → teacher._id, teacher._id → teacher._id
const classMap = {}; // "10th Grade A" → class._id
const studentMap = {}; // userId → student._id

const seed = async () => {
  try {
    console.log("Dropping database...");
    await mongoose.connection.dropDatabase();

    // 1. Users
    console.log("Seeding Users...");
    const users = await User.insertMany(
      (seedData.users || []).map((u) => ({
        ...u,
        password: hashPassword(u.password),
      }))
    );
    users.forEach((u) => {
      userMap[u.email] = u._id;
      userMap[u._id.toString()] = u._id;
    });

    // 2. Subjects
    console.log("Seeding Subjects...");
    await Subject.insertMany(seedData.subjects || []);

    // 3. Teachers
    console.log("Seeding Teachers...");
    const teachers = await Teacher.insertMany(
      (seedData.teachers || []).map((t) => ({
        ...t,
        userId: userMap[t.userId?.toString()] || userMap[t.userId],
      }))
    );
    teachers.forEach((t) => {
      const userIdStr = t.userId.toString();
      const teacherIdStr = t._id.toString();
      teacherMap[userIdStr] = t._id;
      teacherMap[teacherIdStr] = t._id; // Critical: allow lookup by teacher._id
    });

    // 4. Classes
    console.log("Seeding Classes...");
    const classes = await Class.insertMany(
      (seedData.classes || []).map((c) => {
        const classTeacherId = c.classTeacherId
          ? teacherMap[c.classTeacherId.toString()] ||
            teacherMap[c.classTeacherId]
          : null;

        return {
          ...c,
          classTeacherId,
        };
      })
    );
    classes.forEach((c) => {
      const key = `${c.name} ${c.section || ""}`.trim();
      classMap[key] = c._id;
    });

    // 5. Students
    console.log("Seeding Students...");
    const students = await Student.insertMany(
      (seedData.students || []).map((s) => {
        const userId = userMap[s.userId?.toString()] || userMap[s.userId];
        const classKey = classes.find(
          (cls) => cls._id.toString() === s.classId?.toString()
        )
          ? s.classId
          : classMap[`${s.className || ""} ${s.section || ""}`.trim()] ||
            classes[0]?._id;

        return {
          ...s,
          userId,
          classId: classKey,
        };
      })
    );
    students.forEach((s) => {
      studentMap[s.userId.toString()] = s._id;
    });

    // 6. Timetables
    console.log("Seeding Timetables...");
    await Timetable.insertMany(
      (seedData.timetables || []).map((t) => {
        const classKey = classes.find(
          (c) => c._id.toString() === t.classId?.toString()
        )
          ? t.classId
          : classMap[`${t.className || ""} ${t.section || ""}`.trim()] ||
            classes[0]?._id;

        const teacherId =
          teacherMap[t.teacherId?.toString()] ||
          teacherMap[t.teacherUserId?.toString()] ||
          teachers[0]?._id;

        return {
          ...t,
          classId: classKey,
          teacherId,
          subjectId: t.subjectId,
        };
      })
    );

    // 7. Attendance (Safe)
    console.log("Seeding Attendance...");
    const attendanceToInsert = (seedData.attendance || []).map((a) => {
      const studentId = studentMap[a.studentId?.toString()] || students[0]?._id;
      const classId =
        classMap[`${a.className || ""} ${a.section || ""}`.trim()] ||
        classes[0]?._id;

      return {
        studentId,
        classId,
        date: new Date(a.date),
        status: a.status || "present",
      };
    });

    // Deduplicate by student + date
    const seen = new Set();
    const uniqueAttendance = attendanceToInsert.filter((item) => {
      const key = `${item.studentId}-${
        new Date(item.date).toISOString().split("T")[0]
      }`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    await Attendance.insertMany(uniqueAttendance);

    // 8. Exams (Safe)
    console.log("Seeding Exams...");
    if (seedData.exams && seedData.exams.length > 0) {
      await Exam.insertMany(
        (seedData.exams || []).map((e) => {
          const classKey =
            classMap[`${e.className || ""} ${e.section || ""}`.trim()] ||
            classes[0]?._id;
          return {
            ...e,
            classId: classKey,
            results: (e.results || []).map((r) => ({
              ...r,
              studentId:
                studentMap[r.studentId?.toString()] ||
                studentMap[r.studentUserId?.toString()] ||
                students[0]?._id,
            })),
          };
        })
      );
    }

    // 9. Progress
    console.log("Seeding Progress...");
    if (seedData.progress && seedData.progress.length > 0) {
      await Progress.insertMany(
        (seedData.progress || []).map((p) => {
          const classKey =
            classMap[`${p.className || ""} ${p.section || ""}`.trim()] ||
            classes[0]?._id;
          return {
            ...p,
            studentId:
              studentMap[p.studentId?.toString()] ||
              studentMap[p.studentUserId?.toString()] ||
              students[0]?._id,
            classId: classKey,
          };
        })
      );
    }

    // 10. Events, Announcements, Testimonials
    console.log("Seeding Events, Announcements, etc...");
    await Event.insertMany(seedData.events || []);
    await Announcement.insertMany(seedData.announcements || []);
    await Testimonial.insertMany(seedData.testimonials || []);

    // 11. Contact Messages
    await ContactMessage.insertMany(
      (seedData.contactMessages || []).map((c) => ({
        ...c,
        studentId: studentMap[c.studentId?.toString()] || students[0]?._id,
        teacherId: teacherMap[c.teacherId?.toString()] || teachers[0]?._id,
      }))
    );

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seed();
