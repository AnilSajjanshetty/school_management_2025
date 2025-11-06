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

    // Find teacher
    const teacher = await Teacher.findOne({ userId }).populate("subjects");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find user details
    const user = await User.findById(userId);

    // Find class where teacher is class teacher
    const myClass = await Class.findOne({ classTeacherId: teacher._id })
      .populate("subjects");

    // Find all classes where teacher teaches
    const teachingClasses = await Timetable.find({ teacherId: teacher._id })
      .populate("classId", "name section")
      .populate("subjectId", "name")
      .distinct("classId");

    const uniqueTeachingClasses = await Class.find({
      _id: { $in: teachingClasses }
    }).populate("subjects");

    // Get students count for my class
    let myClassStudentsCount = 0;
    if (myClass) {
      myClassStudentsCount = await Student.countDocuments({ classId: myClass._id });
    }

    // Get total students taught
    const allTeachingClassIds = uniqueTeachingClasses.map(c => c._id);
    const totalStudentsTaught = await Student.countDocuments({
      classId: { $in: allTeachingClassIds }
    });

    // Get upcoming exams (next 30 days)
    const upcomingExams = await Exam.find({
      classId: { $in: [...allTeachingClassIds, myClass?._id].filter(Boolean) },
      date: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    })
      .populate("classId", "name section")
      .sort({ date: 1 })
      .limit(5);

    // Get recent attendance records
    const recentAttendance = await Attendance.find({
      classId: { $in: [...allTeachingClassIds, myClass?._id].filter(Boolean) }
    })
      .populate("classId", "name section")
      .populate("studentId", "rollNumber")
      .sort({ date: -1 })
      .limit(10);

    // Calculate average attendance for my class
    let myClassAvgAttendance = 0;
    if (myClass) {
      const classAttendance = await Attendance.find({ classId: myClass._id });
      if (classAttendance.length > 0) {
        const totalPresent = classAttendance.reduce((sum, rec) => sum + (rec.present || 0), 0);
        const totalTotal = classAttendance.reduce((sum, rec) => sum + ((rec.present || 0) + (rec.absent || 0)), 0);
        myClassAvgAttendance = totalTotal > 0 ? Math.round((totalPresent / totalTotal) * 100) : 0;
      }
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.profilePic
      },
      teacher,
      myClass: myClass ? {
        _id: myClass._id,
        name: myClass.name,
        section: myClass.section,
        studentsCount: myClassStudentsCount,
        subjects: myClass.subjects,
        avgAttendance: myClassAvgAttendance
      } : null,
      teachingClasses: uniqueTeachingClasses.map(c => ({
        _id: c._id,
        name: c.name,
        section: c.section,
        subjects: c.subjects
      })),
      stats: {
        totalStudentsTaught,
        myClassStudentsCount,
        teachingClassesCount: uniqueTeachingClasses.length,
        upcomingExamsCount: upcomingExams.length
      },
      upcomingExams: upcomingExams.map(exam => ({
        _id: exam._id,
        title: exam.title,
        subject: exam.subject,
        date: exam.date,
        className: `${exam.classId.name} ${exam.classId.section || ""}`.trim(),
        totalMarks: exam.totalMarks,
        duration: exam.duration,
        room: exam.room
      })),
      recentAttendance: recentAttendance.map(att => ({
        _id: att._id,
        date: att.date,
        className: `${att.classId.name} ${att.classId.section || ""}`.trim(),
        present: att.present || 0,
        absent: att.absent || 0,
        status: att.status,
        studentRoll: att.studentId?.rollNumber
      }))
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

    const myClass = await Class.findOne({ classTeacherId: teacher._id })
      .populate("subjects");

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
          studentId: student._id
        });

        const presentCount = attendanceRecords.filter(a => a.status === "present").length;
        const totalRecords = attendanceRecords.length;
        const attendancePercentage = totalRecords > 0 
          ? Math.round((presentCount / totalRecords) * 100) 
          : 0;

        // Get exam results
        const exams = await Exam.find({
          classId: myClass._id,
          "results.studentId": student._id
        });

        let avgMarks = 0;
        if (exams.length > 0) {
          const totalMarks = exams.reduce((sum, exam) => {
            const result = exam.results.find(r => r.studentId.toString() === student._id.toString());
            return sum + (result?.marksObtained || 0);
          }, 0);
          const totalPossible = exams.reduce((sum, exam) => sum + exam.totalMarks, 0);
          avgMarks = totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0;
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
          totalAttendanceRecords: totalRecords
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
        totalStudents: students.length
      },
      students: studentsWithStats,
      recentAttendance: classAttendance.map(att => ({
        _id: att._id,
        date: att.date,
        present: att.present || 0,
        absent: att.absent || 0,
        total: (att.present || 0) + (att.absent || 0),
        percentage: ((att.present || 0) / ((att.present || 0) + (att.absent || 0)) * 100).toFixed(1)
      }))
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
    
    timetableEntries.forEach(entry => {
      const classId = entry.classId._id.toString();
      if (!classMap.has(classId)) {
        classMap.set(classId, {
          _id: entry.classId._id,
          name: entry.classId.name,
          section: entry.classId.section,
          subjects: new Set(),
          periodsCount: 0,
          schedule: []
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
        room: entry.room
      });
    });

    // Convert to array and get student counts
    const teachingClasses = await Promise.all(
      Array.from(classMap.values()).map(async (classData) => {
        const studentsCount = await Student.countDocuments({ classId: classData._id });
        
        return {
          ...classData,
          subjects: Array.from(classData.subjects),
          studentsCount,
          schedule: classData.schedule.sort((a, b) => {
            const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.period - b.period;
          })
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
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const groupedTimetable = {};

    dayOrder.forEach(day => {
      groupedTimetable[day] = timetable
        .filter(entry => entry.day === day)
        .map(entry => ({
          _id: entry._id,
          period: entry.period,
          subject: entry.subjectId.name,
          subjectCode: entry.subjectId.code,
          className: `${entry.classId.name} ${entry.classId.section || ""}`.trim(),
          startTime: entry.startTime,
          endTime: entry.endTime,
          room: entry.room
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
    const events = await Event.find({ public: true })
      .sort({ date: 1 });

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
    const teachingClasses = await Timetable.find({ teacherId: teacher._id })
      .distinct("classId");

    const allClassIds = [...teachingClasses];
    if (myClass) allClassIds.push(myClass._id);

    const exams = await Exam.find({
      classId: { $in: allClassIds }
    })
      .populate("classId", "name section")
      .sort({ date: -1 });

    const formattedExams = exams.map(exam => ({
      _id: exam._id,
      title: exam.title,
      subject: exam.subject,
      className: `${exam.classId.name} ${exam.classId.section || ""}`.trim(),
      date: exam.date,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      room: exam.room,
      resultsCount: exam.results.length,
      isPast: new Date(exam.date) < new Date()
    }));

    res.json(formattedExams);
  } catch (error) {
    console.error("Error fetching teacher exams:", error);
    res.status(500).json({ message: error.message });
  }
};