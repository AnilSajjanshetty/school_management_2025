// seed/seedExamsAndProgress.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Exam from "./models/Exam.js";
import Progress from "./models/Progress.js";
import Class from "./models/Class.js";
import Student from "./models/Student.js";

dotenv.config();

const seedExamsAndProgress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Step 1: Get one class and one student
    const classes = await Class.find();
    const students = await Student.find();

    if (classes.length === 0 || students.length === 0) {
      console.log("⚠️ No classes or students found. Seed those first.");
      process.exit(0);
    }

    const classId = classes[0]._id;
    const studentId = students[0]._id;

    // Step 2: Clear old Exam and Progress data
    await Exam.deleteMany({});
    await Progress.deleteMany({});
    console.log("🧹 Cleared old Exam and Progress data");

    // Step 3: Seed Exams
    const exams = await Exam.insertMany([
      {
        title: "Mid-Term Exam",
        classId,
        subject: "Mathematics",
        date: new Date("2025-08-01"),
        duration: 90,
        totalMarks: 100,
        room: "Room 101",
        results: [{ studentId, marksObtained: 85, grade: "A" }],
      },
      {
        title: "Final Exam",
        classId,
        subject: "Science",
        date: new Date("2025-11-01"),
        duration: 120,
        totalMarks: 100,
        room: "Room 102",
        results: [{ studentId, marksObtained: 78, grade: "B" }],
      },
    ]);

    console.log(`🧪 Seeded ${exams.length} exams.`);

    // Step 4: Seed Progress (5 records)
    const progress = await Progress.insertMany([
      {
        studentId,
        classId,
        type: "academic",
        score: 88,
        date: new Date("2025-08-05"),
        teacherComment: "Strong grasp of core math concepts.",
        parentComment: "Proud of progress!",
        goals: ["Focus on geometry", "Practice algebra daily"],
      },
      {
        studentId,
        classId,
        type: "academic",
        score: 92,
        date: new Date("2025-09-10"),
        teacherComment: "Excellent performance in science practicals.",
        parentComment: "Keep it up!",
        goals: ["Prepare early for next test"],
      },
      {
        studentId,
        classId,
        type: "behavioral",
        score: 85,
        date: new Date("2025-09-25"),
        teacherComment: "Polite and respectful, good teamwork skills.",
        parentComment: "Very happy with attitude.",
        goals: ["Take more leadership roles"],
      },
      {
        studentId,
        classId,
        type: "attendance",
        score: 95,
        date: new Date("2025-10-01"),
        teacherComment: "Almost perfect attendance this term.",
        parentComment: "Always on time.",
        goals: ["Maintain punctuality"],
      },
      {
        studentId,
        classId,
        type: "academic",
        score: 90,
        date: new Date("2025-10-15"),
        teacherComment: "Improved writing and comprehension.",
        parentComment: "Great improvement noticed.",
        goals: ["Work on creative assignments"],
      },
    ]);

    console.log(`📈 Seeded ${progress.length} progress records.`);
    console.log("✅ Seeding completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedExamsAndProgress();
