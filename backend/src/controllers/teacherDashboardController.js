// controllers/teacherDashboardController.js
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Announcement from "../models/Announcement.js";
import Event from "../models/Event.js";
import Exam from "../models/Exam.js";
import Timetable from "../models/Timetable.js";
import Attendance from "../models/Attendance.js";
import ContactMessage from "../models/ContactMessage.js";

export const getTeacherDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacher = await Teacher.findOne({ userId })
      .populate("userId", "name email phone")
      .populate("subjects", "name");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // FIX 1: Find classes where teacher is in subjectTeachers OR classTeacher
    // In getTeacherDashboard
    const teacherClasses = await Class.find({
      $or: [
        { classTeacherId: teacher._id },
        { "subjectTeachers.teacherId": teacher._id },
      ],
    }).populate("subjects", "name");

    const classIds = teacherClasses.map((c) => c._id);

    // Students
    const students = await Student.find({ classId: { $in: classIds } })
      .populate("userId", "name email")
      .populate("classId", "name section")
      .lean();

    // FIX 2: Attendance by class + date (aggregated)
    const attendanceRecords = await Attendance.find({
      classId: { $in: classIds },
    });
    const attendanceByClass = {};

    teacherClasses.forEach((cls) => {
      const classIdStr = cls._id.toString();
      const records = attendanceRecords.filter(
        (r) => r.classId.toString() === classIdStr
      );

      const dailyMap = {};
      records.forEach((r) => {
        const dateStr = r.date.toISOString().split("T")[0];
        if (!dailyMap[dateStr]) dailyMap[dateStr] = { present: 0, total: 0 };
        dailyMap[dateStr].present += r.present || 0;
        dailyMap[dateStr].total += r.total || 1;
      });

      attendanceByClass[classIdStr] = Object.entries(dailyMap)
        .map(([date, d]) => ({
          date,
          present: d.present,
          total: d.total,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    });

    // Exams
    const exams = await Exam.find({
      classId: { $in: teacherClasses.map((c) => c._id) },
    }).populate("classId", "name section");

    const examData = exams.map((exam) => ({
      id: exam._id,
      title: exam.title,
      subject: exam.subject,
      classId: exam.classId._id,
      className: `${exam.classId.name} ${exam.classId.section}`,
      date: exam.date,
      totalMarks: exam.totalMarks,
      results: exam.results.map((r) => ({
        id: `${exam._id}-${r.studentId}`,
        studentId: r.studentId,
        studentName:
          students.find((s) => s._id.toString() === r.studentId.toString())
            ?.name || "Unknown",
        marks: r.marksObtained,
        grade: r.grade,
      })),
    }));

    // Timetable
    const timetableEntries = await Timetable.find({ teacherId: teacher._id })
      .populate("subjectId", "name")
      .populate("classId", "name section");

    const schedule = {};
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].forEach((day) => {
      schedule[day] = timetableEntries
        .filter((t) => t.day === day)
        .sort((a, b) => a.period - b.period)
        .map((t) => ({
          period: t.period,
          subject: t.subjectId?.name || "N/A",
          classId: t.classId?._id,
          className: `${t.classId?.name || ""} ${
            t.classId?.section || ""
          }`.trim(),
          time: `${t.startTime} - ${t.endTime}`,
          room: t.room || "N/A",
        }));
    });

    // Announcements, Events, Messages
    const announcements = await Announcement.find({
      $or: [
        { visibility: "public" },
        { visibility: { $in: classIds.map((id) => `class:${id}`) } },
      ],
    })
      .sort({ date: -1 })
      .limit(20);

    const events = await Event.find({
      $or: [{ public: true }, { classId: { $in: classIds } }],
    }).sort({ date: 1 });

    const contactMessages = await ContactMessage.find({
      $or: [
        { teacherId: teacher._id },
        { studentId: { $in: students.map((s) => s._id) } },
      ],
    })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ date: -1 });

    // Stats
    const totalStudents = students.length;
    const avgAttendance =
      totalStudents > 0
        ? Math.round(
            students.reduce((sum, s) => {
              const att = attendanceByClass[s.classId.toString()] || [];
              const total = att.reduce((a, b) => a + b.total, 0);
              const present = att.reduce((a, b) => a + b.present, 0);
              return sum + (total > 0 ? (present / total) * 100 : 0);
            }, 0) / totalStudents
          )
        : 0;

    const contactStats = {
      feedback: contactMessages.filter((m) => m.type === "feedback").length,
      complaint: contactMessages.filter((m) => m.type === "complaint").length,
      inquiry: contactMessages.filter((m) => m.type === "inquiry").length,
    };

    const upcomingEvents = events.filter(
      (e) => new Date(e.date) >= new Date()
    ).length;

    res.json({
      teacher: {
        id: teacher._id,
        name: teacher.userId.name,
        email: teacher.userId.email,
        phone: teacher.userId.phone,
        subjects: teacher.subjects.map((s) => s.name),
      },
      // In the res.json({ classes: ... }) section
      classes: teacherClasses.map((c) => ({
        id: c._id,
        name: c.name,
        section: c.section,
        classTeacherId: c.classTeacherId, // ADD THIS
        subjectTeachers: c.subjectTeachers || [], // ADD THIS
        subjects: c.subjects.map((s) => ({ id: s._id, name: s.name })),
        studentCount: students.filter(
          (s) => s.classId._id.toString() === c._id.toString()
        ).length,
      })),
      students: students.map((s) => ({
        id: s._id,
        name: s.userId?.name || "Unknown Student",
        email: s.userId?.email || "N/A",
        classId: s.classId._id,
        className: s.classId.name,
        section: s.classId.section,
      })),
      timetable: { teacherId: teacher._id, schedule },
      announcements: announcements.map((a) => ({
        id: a._id,
        title: a.title,
        content: a.content,
        date: a.date,
        visibility: a.visibility,
      })),
      events: events.map((e) => ({
        id: e._id,
        title: e.title,
        content: e.content,
        date: e.date,
        public: e.public,
        classId: e.classId,
      })),
      exams: examData,
      attendance: attendanceByClass,
      contactMessages: contactMessages.map((m) => ({
        id: m._id,
        studentId: m.studentId?._id,
        studentName: m.studentId?.userId?.name || "Unknown",
        type: m.type,
        message: m.message,
        date: m.date,
        status: m.status,
      })),
      statistics: {
        totalStudents,
        avgAttendance,
        complaints: contactStats.complaint,
        upcomingEvents,
        contactStats,
      },
    });
  } catch (error) {
    console.error("Teacher Dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
