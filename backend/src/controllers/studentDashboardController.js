// controllers/studentDashboardController.js
import Student from "../models/Student.js";
import User from "../models/User.js";
import Announcement from "../models/Announcement.js";
import Event from "../models/Event.js";
import Exam from "../models/Exam.js";
import Timetable from "../models/Timetable.js";
import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";
import Progress from "../models/Progress.js";
import Subject from "../models/Subject.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get student
    const student = await Student.findOne({ userId })
      .populate("userId", "name email phone")
      .populate("classId");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate attendance percentage
    const attendanceRecords = await Attendance.find({
      studentId: student._id,
    });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(
      (a) => a.status === "present"
    ).length;
    const attendancePercentage =
      totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

    // Calculate average score from progress/exams
    const progressRecords = await Progress.find({
      studentId: student._id,
      type: "academic",
    });
    const avgScore =
      progressRecords.length > 0
        ? (
            progressRecords.reduce((sum, p) => sum + (p.score || 0), 0) /
            progressRecords.length
          ).toFixed(1)
        : 0;

    // Get timetable and format it
    const timetableEntries = await Timetable.find({
      classId: student.classId,
    })
      .populate("subjectId", "name")
      .populate("teacherId")
      .sort({ day: 1, period: 1 });

    // Format timetable into schedule object
    const schedule = {};
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    days.forEach((day) => {
      schedule[day] = timetableEntries
        .filter((t) => t.day === day)
        .sort((a, b) => a.period - b.period)
        .map((t) => ({
          period: t.period,
          subject: t.subjectId?.name || "N/A",
          teacher: t.teacherId?.userId?.name || "N/A",
          time: `${t.startTime} - ${t.endTime}`,
          room: t.room || "N/A",
        }));
    });

    // Get announcements (add visibility field to your Announcement schema)
    const announcements = await Announcement.find({
      $or: [
        { visibility: "public" },
        { visibility: `class:${student.classId}` },
      ],
    })
      .sort({ date: -1 })
      .limit(10);

    // Get events for this class
    const events = await Event.find({
      $or: [{ public: true }, { classId: student.classId }],
    }).sort({ date: 1 });

    // Get upcoming exams
    const exams = await Exam.find({
      classId: student.classId,
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    // Format response
    const dashboardData = {
      student: {
        id: student._id,
        name: student.userId.name,
        email: student.userId.email,
        roll: student.rollNumber,
        classId: student.classId._id,
        className: student.classId.name,
        attendance: attendancePercentage,
        avgScore: avgScore,
      },
      timetable: {
        classId: student.classId._id,
        schedule: schedule,
      },
      announcements,
      events,
      exams,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
