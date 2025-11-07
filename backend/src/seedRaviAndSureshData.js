// seedRaviAndSureshData.js
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
// Replace with your MongoDB URL
const MONGO_URI = "mongodb://localhost:27017/schoolDB"; // Change if needed
const DB_NAME = "student_management";

async function seed() {
  const client = new MongoClient(MONGO_URI);
  let db;

  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");

    // === Teacher & Class IDs ===
    const RAVI_TEACHER_ID = "6730a7f2c5f8a1b003000001";
    const SURESH_TEACHER_ID = "6730a7f2c5f8a1b003000003";

    const CLASS_8A_ID = "6730a8f2c5f8a1b004000003"; // 8th Grade A
    const CLASS_10A_ID = "6730a8f2c5f8a1b004000001"; // 10th Grade A

    const MATH_ID = "6730a6f2c5f8a1b002000001";
    const SCIENCE_ID = "6730a6f2c5f8a1b002000002";
    const ENGLISH_ID = "6730a6f2c5f8a1b002000003";

    // === Students ===
    const STUDENTS_8A = ["6730a9f2c5f8a1b005000006"]; // Priya in 8A
    const STUDENTS_10A = [
      "6730a9f2c5f8a1b005000001", // Priya
      "6730a9f2c5f8a1b005000003", // Rohan
      "6730a9f2c5f8a1b005000004", // Kavya
    ];

    // === 1. Fix subjectTeachers ===
    await db.collection("classes").updateOne(
      { _id: new ObjectId(CLASS_8A_ID) },
      {
        $set: {
          classTeacherId: new ObjectId(RAVI_TEACHER_ID),
          subjectTeachers: [
            {
              teacherId: new ObjectId(RAVI_TEACHER_ID),
              subjectId: new ObjectId(MATH_ID),
            },
            {
              teacherId: new ObjectId(RAVI_TEACHER_ID),
              subjectId: new ObjectId(SCIENCE_ID),
            },
          ],
        },
      }
    );
    console.log("Updated 8th Grade A (Ravi)");

    await db.collection("classes").updateOne(
      { _id: new ObjectId(CLASS_10A_ID) },
      {
        $set: {
          classTeacherId: new ObjectId(SURESH_TEACHER_ID),
          subjectTeachers: [
            {
              teacherId: new ObjectId(SURESH_TEACHER_ID),
              subjectId: new ObjectId(MATH_ID),
            },
            {
              teacherId: new ObjectId(SURESH_TEACHER_ID),
              subjectId: new ObjectId(SCIENCE_ID),
            },
            {
              teacherId: new ObjectId(SURESH_TEACHER_ID),
              subjectId: new ObjectId(ENGLISH_ID),
            },
          ],
        },
      }
    );
    console.log("Updated 10th Grade A (Suresh)");

    // === 2. Seed Attendance (12 days) ===
    const startDate = new Date("2025-11-01T00:00:00.000Z");
    const attendanceRecords = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // 8A - Ravi
      STUDENTS_8A.forEach((sid) => {
        const present = Math.random() > 0.2;
        attendanceRecords.push({
          studentId: new ObjectId(sid),
          classId: new ObjectId(CLASS_8A_ID),
          date: date,
          status: present ? "present" : "absent",
          present: present ? 1 : 0,
          total: 1,
        });
      });

      // 10A - Suresh
      STUDENTS_10A.forEach((sid) => {
        const present = Math.random() > 0.25;
        attendanceRecords.push({
          studentId: new ObjectId(sid),
          classId: new ObjectId(CLASS_10A_ID),
          date: date,
          status: present ? "present" : "absent",
          present: present ? 1 : 0,
          total: 1,
        });
      });
    }

    // Remove duplicates
    const existing = new Set(
      (
        await db
          .collection("attendances")
          .find({
            classId: {
              $in: [new ObjectId(CLASS_8A_ID), new ObjectId(CLASS_10A_ID)],
            },
          })
          .toArray()
      ).map(
        (a) =>
          `${a.classId}-${a.date.toISOString().split("T")[0]}-${a.studentId}`
      )
    );

    const newAttendance = attendanceRecords.filter(
      (r) =>
        !existing.has(
          `${r.classId}-${r.date.toISOString().split("T")[0]}-${r.studentId}`
        )
    );

    if (newAttendance.length > 0) {
      const result = await db
        .collection("attendances")
        .insertMany(newAttendance);
      console.log(`Inserted ${result.insertedCount} attendance records`);
    } else {
      console.log("Attendance already exists");
    }

    // === 3. Add Exams + Results ===
    const examsToInsert = [
      // Ravi - 8th Grade A
      {
        title: "Mid-Term Exam",
        classId: new ObjectId(CLASS_8A_ID),
        subject: "Mathematics",
        date: new Date("2025-11-15T00:00:00.000Z"),
        duration: 90,
        totalMarks: 100,
        room: "Room 201",
        results: STUDENTS_8A.map((sid) => ({
          studentId: new ObjectId(sid),
          marksObtained: 75 + Math.floor(Math.random() * 20),
          grade: "A",
        })),
      },
      {
        title: "Final Exam",
        classId: new ObjectId(CLASS_8A_ID),
        subject: "Science",
        date: new Date("2025-12-01T00:00:00.000Z"),
        duration: 120,
        totalMarks: 100,
        room: "Lab 2",
        results: STUDENTS_8A.map((sid) => ({
          studentId: new ObjectId(sid),
          marksObtained: 70 + Math.floor(Math.random() * 25),
          grade: "B+",
        })),
      },
      // Suresh - 10th Grade A
      {
        title: "Mid-Term Exam",
        classId: new ObjectId(CLASS_10A_ID),
        subject: "Mathematics",
        date: new Date("2025-11-15T00:00:00.000Z"),
        duration: 90,
        totalMarks: 100,
        room: "Room 101",
        results: STUDENTS_10A.map((sid) => ({
          studentId: new ObjectId(sid),
          marksObtained: 68 + Math.floor(Math.random() * 27),
          grade: "A",
        })),
      },
      {
        title: "Final Exam",
        classId: new ObjectId(CLASS_10A_ID),
        subject: "Science",
        date: new Date("2025-12-01T00:00:00.000Z"),
        duration: 120,
        totalMarks: 100,
        room: "Lab 1",
        results: STUDENTS_10A.map((sid) => ({
          studentId: new ObjectId(sid),
          marksObtained: 65 + Math.floor(Math.random() * 30),
          grade: "B+",
        })),
      },
    ];

    let inserted = 0;
    for (const exam of examsToInsert) {
      const exists = await db.collection("exams").findOne({
        title: exam.title,
        classId: exam.classId,
        subject: exam.subject,
      });
      if (!exists) {
        await db.collection("exams").insertOne(exam);
        inserted++;
      }
    }
    console.log(`Inserted ${inserted} new exams`);

    console.log("\nBoth Ravi & Suresh data seeded successfully!");
    console.log("Login as:");
    console.log("  Ravi: ravi@school.com");
    console.log("  Suresh: suresh@school.com");
    console.log("Graphs will show 12+ days of attendance + 2 exams each");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
