// controllers/teacherController.js
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Exam from "../models/Exam.js";
import Timetable from "../models/Timetable.js";
import Announcement from "../models/Announcement.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

// Get teacher dashboard overview
export const getTeacherDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // ---------- 1. BASIC TEACHER INFO ----------
    const teacher = await Teacher.findOne({ userId }).populate("subjects");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const user = await User.findById(userId);

    // ---------- 2. MY CLASS ----------
    const myClass = await Class.findOne({
      classTeacherId: teacher._id,
    }).populate("subjects");
    const myClassStudentsCount = myClass
      ? await Student.countDocuments({ classId: myClass._id })
      : 0;

    // ---------- 3. TEACHING CLASSES ----------
    const teachingClassIds = await Timetable.find({
      teacherId: teacher._id,
    }).distinct("classId");

    const teachingClasses = await Class.find({
      _id: { $in: teachingClassIds },
    }).populate("subjects");

    const allClassIds = teachingClassIds.concat(myClass?._id).filter(Boolean);

    // ---------- 4. STUDENT COUNTS ----------
    const totalStudentsTaught = await Student.countDocuments({
      classId: { $in: allClassIds },
    });

    // ---------- 5. UPCOMING EXAMS ----------
    const upcomingExams = await Exam.find({
      classId: { $in: allClassIds },
      date: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
      .populate("classId", "name section")
      .sort({ date: 1 })
      .limit(5);

    // ---------- 6. RECENT ATTENDANCE ----------
    const recentAttendance = await Attendance.find({
      classId: { $in: allClassIds },
    })
      .populate("classId", "name section")
      .populate("studentId", "rollNumber")
      .sort({ date: -1 })
      .limit(10);

    // ---------- 7. AVG ATTENDANCE (my class only) ----------
    let myClassAvgAttendance = 0;
    if (myClass) {
      const att = await Attendance.find({ classId: myClass._id });
      const totalPresent = att.reduce((s, r) => s + (r.present || 0), 0);
      const totalTotal = att.reduce(
        (s, r) => s + ((r.present || 0) + (r.absent || 0)),
        0
      );
      myClassAvgAttendance = totalTotal
        ? Math.round((totalPresent / totalTotal) * 100)
        : 0;
    }

    // ---------- 8. RECENT ANNOUNCEMENTS ----------
    const recentAnnouncements = await Announcement.find()
      .sort({ date: -1 })
      .limit(5)
      .select("title date");

    // ---------- 9. UPCOMING EVENTS ----------
    const upcomingEvents = await Event.find({
      public: true,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5)
      .select("title date");

    // ---------- 10. ATTENDANCE TREND (last 7 days) ----------
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyAtt = await Attendance.aggregate([
      {
        $match: { classId: { $in: allClassIds }, date: { $gte: sevenDaysAgo } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          present: { $sum: { $cond: ["$present", 1, 0] } },
          total: { $sum: { $add: ["$present", "$absent"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const attendanceTrend = dailyAtt.map((d) => ({
      date: new Date(d._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      percentage: d.total ? Math.round((d.present / d.total) * 100) : 0,
    }));

    // ---------- 11. RESPONSE ----------
    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.profilePic,
      },

      teacher,

      myClass: myClass
        ? {
            _id: myClass._id,
            name: myClass.name,
            section: myClass.section,
            studentsCount: myClassStudentsCount,
            subjects: myClass.subjects,
            avgAttendance: myClassAvgAttendance,
          }
        : null,

      teachingClasses: teachingClasses.map((c) => ({
        _id: c._id,
        name: c.name,
        section: c.section,
        subjects: c.subjects,
      })),

      // ---------- OVERVIEW-TAB FRIENDLY FIELDS ----------
      totalStudents: totalStudentsTaught,
      avgAttendance: myClassAvgAttendance,
      pendingTasks: 0, // you can add a real count later
      examsScheduled: upcomingExams.length,

      attendanceTrend, // chart data
      recentAnnouncements: recentAnnouncements.map((a) => ({
        title: a.title,
        date: new Date(a.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
      upcomingEvents: upcomingEvents.map((e) => ({
        title: e.title,
        date: new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),

      // ---------- LEGACY FIELDS (kept for other tabs) ----------
      stats: {
        totalStudentsTaught,
        myClassStudentsCount,
        teachingClassesCount: teachingClasses.length,
        upcomingExamsCount: upcomingExams.length,
      },
      upcomingExams: upcomingExams.map((exam) => ({
        _id: exam._id,
        title: exam.title,
        subject: exam.subject,
        date: exam.date,
        className: `${exam.classId.name} ${exam.classId.section || ""}`.trim(),
        totalMarks: exam.totalMarks,
        duration: exam.duration,
        room: exam.room,
      })),
      recentAttendance: recentAttendance.map((att) => ({
        _id: att._id,
        date: att.date,
        className: `${att.classId.name} ${att.classId.section || ""}`.trim(),
        present: att.present || 0,
        absent: att.absent || 0,
        status: att.status,
        studentRoll: att.studentId?.rollNumber,
      })),
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get my class details (students, attendance, performance)
export const getMyClassDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const myClass = await Class.findOne({
      classTeacherId: teacher._id,
    }).populate("subjects");

    if (!myClass) {
      return res.status(404).json({ message: "No class assigned" });
    }

    // Get all students
    const students = await Student.find({ classId: myClass._id })
      .populate("userId", "name email phone profilePic")
      .sort({ rollNumber: 1 });

    // Get attendance stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const attendanceRecords = await Attendance.find({
          studentId: student._id,
        });

        const presentCount = attendanceRecords.filter(
          (a) => a.status === "present"
        ).length;
        const totalRecords = attendanceRecords.length;
        const attendancePercentage =
          totalRecords > 0
            ? Math.round((presentCount / totalRecords) * 100)
            : 0;

        // Get exam results
        const exams = await Exam.find({
          classId: myClass._id,
          "results.studentId": student._id,
        });

        let avgMarks = 0;
        if (exams.length > 0) {
          const totalMarks = exams.reduce((sum, exam) => {
            const result = exam.results.find(
              (r) => r.studentId.toString() === student._id.toString()
            );
            return sum + (result?.marksObtained || 0);
          }, 0);
          const totalPossible = exams.reduce(
            (sum, exam) => sum + exam.totalMarks,
            0
          );
          avgMarks =
            totalPossible > 0
              ? Math.round((totalMarks / totalPossible) * 100)
              : 0;
        }

        return {
          _id: student._id,
          rollNumber: student.rollNumber,
          name: student.userId.name,
          email: student.userId.email,
          phone: student.userId.phone,
          profilePic: student.userId.profilePic,
          admissionDate: student.admissionDate,
          attendancePercentage,
          avgMarks,
          totalAttendanceRecords: totalRecords,
        };
      })
    );

    // Get class-wide attendance
    const classAttendance = await Attendance.find({ classId: myClass._id })
      .sort({ date: -1 })
      .limit(30);

    res.json({
      class: {
        _id: myClass._id,
        name: myClass.name,
        section: myClass.section,
        subjects: myClass.subjects,
        totalStudents: students.length,
      },
      students: studentsWithStats,
      recentAttendance: classAttendance.map((att) => ({
        _id: att._id,
        date: att.date,
        present: att.present || 0,
        absent: att.absent || 0,
        total: (att.present || 0) + (att.absent || 0),
        percentage: (
          ((att.present || 0) / ((att.present || 0) + (att.absent || 0))) *
          100
        ).toFixed(1),
      })),
    });
  } catch (error) {
    console.error("Error fetching my class details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get teaching classes details
export const getTeachingClasses = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find all timetable entries for this teacher
    const timetableEntries = await Timetable.find({ teacherId: teacher._id })
      .populate("classId", "name section")
      .populate("subjectId", "name code");

    // Group by class
    const classMap = new Map();

    timetableEntries.forEach((entry) => {
      const classId = entry.classId._id.toString();
      if (!classMap.has(classId)) {
        classMap.set(classId, {
          _id: entry.classId._id,
          name: entry.classId.name,
          section: entry.classId.section,
          subjects: new Set(),
          periodsCount: 0,
          schedule: [],
        });
      }

      const classData = classMap.get(classId);
      classData.subjects.add(entry.subjectId.name);
      classData.periodsCount++;
      classData.schedule.push({
        day: entry.day,
        period: entry.period,
        subject: entry.subjectId.name,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
      });
    });

    // Convert to array and get student counts
    const teachingClasses = await Promise.all(
      Array.from(classMap.values()).map(async (classData) => {
        const studentsCount = await Student.countDocuments({
          classId: classData._id,
        });

        return {
          ...classData,
          subjects: Array.from(classData.subjects),
          studentsCount,
          schedule: classData.schedule.sort((a, b) => {
            const dayOrder = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            return (
              dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) ||
              a.period - b.period
            );
          }),
        };
      })
    );

    res.json(teachingClasses);
  } catch (error) {
    console.error("Error fetching teaching classes:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get teacher's timetable
export const getTeacherTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const timetable = await Timetable.find({ teacherId: teacher._id })
      .populate("classId", "name section")
      .populate("subjectId", "name code")
      .sort({ day: 1, period: 1 });

    // Group by day
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const groupedTimetable = {};

    dayOrder.forEach((day) => {
      groupedTimetable[day] = timetable
        .filter((entry) => entry.day === day)
        .map((entry) => ({
          _id: entry._id,
          period: entry.period,
          subject: entry.subjectId.name,
          subjectCode: entry.subjectId.code,
          className: `${entry.classId.name} ${
            entry.classId.section || ""
          }`.trim(),
          startTime: entry.startTime,
          endTime: entry.endTime,
          room: entry.room,
        }));
    });

    res.json(groupedTimetable);
  } catch (error) {
    console.error("Error fetching teacher timetable:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ date: -1 })
      .limit(20);

    res.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ public: true }).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get exams for teacher's classes
export const getTeacherExams = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get my class
    const myClass = await Class.findOne({ classTeacherId: teacher._id });

    // Get teaching classes
    const teachingClasses = await Timetable.find({
      teacherId: teacher._id,
    }).distinct("classId");

    const allClassIds = [...teachingClasses];
    if (myClass) allClassIds.push(myClass._id);

    const exams = await Exam.find({
      classId: { $in: allClassIds },
    })
      .populate("classId", "name section")
      .sort({ date: -1 });

    const formattedExams = exams.map((exam) => ({
      _id: exam._id,
      title: exam.title,
      subject: exam.subject,
      className: `${exam.classId.name} ${exam.classId.section || ""}`.trim(),
      date: exam.date,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      resultsCount: exam.results.length,
      isPast: new Date(exam.date) < new Date(),
    }));

    res.json(formattedExams);
  } catch (error) {
    console.error("Error fetching teacher exams:", error);
    res.status(500).json({ message: error.message });
  }
};

import ContactMessage from "../models/ContactMessage.js";

/**
 * @desc Get all messages related to a teacher
 * @route GET /api/clasteacher/messages/:teacherId
 */
export const getMessages = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const messages = await ContactMessage.find({
      $or: [{ teacherId }],
    })
      .populate("studentId", "name email")
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching teacher messages:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Send a message (student or teacher)
 * @route POST /api/clasteacher/messages
 * @body { senderId, receiverId, message, subject, type }
 */
export const sendMessage = async (req, res) => {
  try {
    const {
      studentId,
      teacherId,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      type,
    } = req.body;

    if (!message || !type) {
      return res.status(400).json({ message: "Message and type are required" });
    }

    const newMessage = new ContactMessage({
      studentId: studentId || null,
      teacherId: teacherId || null,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      type,
    });

    const saved = await newMessage.save();
    const populated = await saved.populate([
      { path: "studentId", select: "name email" },
      { path: "teacherId", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Reply to a message
 * @route PUT /api/clasteacher/messages/reply/:messageId
 * @body { reply, repliedBy }
 */
export const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reply, repliedBy } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const message = await ContactMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.reply = reply;
    message.repliedAt = new Date();
    message.repliedBy = repliedBy;
    message.status = "resolved";
    await message.save();

    const populated = await message.populate([
      { path: "studentId", select: "name email" },
      { path: "teacherId", select: "name email" },
      { path: "repliedBy", select: "name email" },
    ]);

    res.status(200).json(populated);
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ message: error.message });
  }
};
