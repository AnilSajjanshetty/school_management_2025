// controllers/teacherDashboardController.js
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Announcement from "../models/Announcement.js";
import Event from "../models/Event.js";
import Exam from "../models/Exam.js";
import Timetable from "../models/Timetable.js";
import Attendance from "../models/Attendance.js";
import Progress from "../models/Progress.js";
import ContactMessage from "../models/ContactMessage.js";

export const getTeacherDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get teacher with populated fields
    const teacher = await Teacher.findOne({ userId })
      .populate({
        path: "userId",
        select: "name email phone ",
      })
      .populate({
        path: "subjects",
        select: "name code",
      });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get all classes where this teacher is the class teacher or teaches a subject
    const teacherClasses = await Class.find({
      $or: [
        { classTeacherId: teacher._id },
        { subjects: { $in: teacher.subjects } },
      ],
    }).populate("subjects", "name code");

    // Get all students in teacher's classes
    const classIds = teacherClasses.map((c) => c._id);
    const students = await Student.find({
      classId: { $in: classIds },
    })
      .populate({
        path: "userId",
        select: "name email phone profilePic",
      })
      .populate({
        path: "classId",
        select: "name section",
      });

    // Calculate attendance and average scores for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        // Get attendance records
        const attendanceRecords = await Attendance.find({
          studentId: student._id,
        });
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(
          (a) => a.status === "present"
        ).length;
        const attendancePercentage =
          totalDays > 0
            ? parseFloat(((presentDays / totalDays) * 100).toFixed(1))
            : 0;

        // Get academic progress
        const progressRecords = await Progress.find({
          studentId: student._id,
          type: "academic",
          score: { $exists: true },
        });
        const avgScore =
          progressRecords.length > 0
            ? parseFloat(
                (
                  progressRecords.reduce((sum, p) => sum + (p.score || 0), 0) /
                  progressRecords.length
                ).toFixed(1)
              )
            : 0;

        return {
          id: student._id,
          name: student.userId?.name || "N/A",
          email: student.userId?.email,
          roll: student.rollNumber,
          classId: student.classId._id,
          className: student.classId?.name || "N/A",
          section: student.classId?.section || "",
          attendance: attendancePercentage,
          avgScore: avgScore,
          avatar: student.userId?.profilePic || null,
        };
      })
    );

    // Get teacher's timetable
    const timetableEntries = await Timetable.find({
      teacherId: teacher._id,
    })
      .populate({
        path: "subjectId",
        select: "name code",
      })
      .populate({
        path: "classId",
        select: "name section",
      })
      .sort({ day: 1, period: 1 });

    // Format timetable into schedule object by day
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
          classId: t.classId?._id,
          className: `${t.classId?.name || ""} ${
            t.classId?.section || ""
          }`.trim(),
          time: `${t.startTime} - ${t.endTime}`,
          room: t.room || "N/A",
        }));
    });

    // Get announcements (teacher's own + public)
    const announcements = await Announcement.find({
      $or: [
        { visibility: "public" },
        { visibility: { $in: classIds.map((id) => `class:${id}`) } },
        { visibility: { $exists: false } },
      ],
    })
      .sort({ date: -1 })
      .limit(20);

    // Get events for teacher's classes
    const events = await Event.find({
      $or: [
        { public: true },
        { classId: { $in: classIds } },
        { classId: { $exists: false } },
      ],
    }).sort({ date: 1 });

    // Get exams for teacher's classes
    const exams = await Exam.find({
      classId: { $in: classIds },
    })
      .populate("classId", "name section")
      .sort({ date: 1 });

    // Get exam results grouped by exam
    const examResults = await Promise.all(
      exams.map(async (exam) => {
        const results = exam.results || [];
        return {
          examId: exam._id,
          examTitle: exam.title,
          classId: exam.classId._id,
          className: `${exam.classId.name} ${
            exam.classId.section || ""
          }`.trim(),
          date: exam.date,
          subject: exam.subject,
          results: results.map((r) => ({
            studentId: r.studentId,
            marksObtained: r.marksObtained,
            grade: r.grade,
          })),
        };
      })
    );

    // Get attendance records for all classes
    const attendanceRecords = await Attendance.find({
      classId: { $in: classIds },
    }).sort({ date: -1 });

    // Group attendance by class and date
    const attendanceByClass = {};
    classIds.forEach((classId) => {
      const classRecords = attendanceRecords.filter(
        (a) => a.classId.toString() === classId.toString()
      );

      attendanceByClass[classId] = classRecords.map((record) => ({
        id: record._id,
        classId: record.classId,
        date: record.date,
        present: record.present || 0,
        total: record.total || 0,
        status: record.status,
      }));
    });

    // Get contact messages
    const contactMessages = await ContactMessage.find({
      $or: [
        { teacherId: teacher._id },
        { studentId: { $in: students.map((s) => s._id) } },
      ],
    })
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ date: -1 });

    // Calculate statistics
    const totalStudents = studentsWithStats.length;

    const avgAttendance =
      studentsWithStats.length > 0
        ? parseFloat(
            (
              studentsWithStats.reduce((sum, s) => sum + s.attendance, 0) /
              studentsWithStats.length
            ).toFixed(1)
          )
        : 0;

    const contactStats = {
      feedback: contactMessages.filter((m) => m.type === "feedback").length,
      complaint: contactMessages.filter((m) => m.type === "complaint").length,
      inquiry: contactMessages.filter((m) => m.type === "inquiry").length,
    };

    const today = new Date().toISOString().split("T")[0];
    const upcomingEventsCount = events.filter(
      (e) => new Date(e.date).toISOString().split("T")[0] >= today
    ).length;

    // Format response
    const dashboardData = {
      teacher: {
        id: teacher._id,
        name: teacher.userId?.name || "N/A",
        email: teacher.userId?.email || "N/A",
        phone: teacher.userId?.phone,
        subjects: teacher.subjects?.map((s) => s.name) || [],
      },
      classes: teacherClasses.map((c) => ({
        id: c._id,
        name: c.name,
        section: c.section || "",
        teacherId: c.classTeacherId,
        subjects: c.subjects?.map((s) => ({ id: s._id, name: s.name })) || [],
        studentCount: studentsWithStats.filter(
          (s) => s.classId.toString() === c._id.toString()
        ).length,
      })),
      students: studentsWithStats,
      timetable: {
        teacherId: teacher._id,
        schedule: schedule,
      },
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
        classId: e.classId,
        public: e.public,
      })),
      exams: exams.map((ex) => ({
        id: ex._id,
        title: ex.title,
        classId: ex.classId._id,
        className: `${ex.classId.name} ${ex.classId.section || ""}`.trim(),
        subject: ex.subject,
        date: ex.date,
        duration: ex.duration,
        totalMarks: ex.totalMarks,
        room: ex.room,
      })),
      examResults: examResults,
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
        upcomingEvents: upcomingEventsCount,
        contactStats,
      },
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Teacher Dashboard error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
