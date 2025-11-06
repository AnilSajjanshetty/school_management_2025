import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import ClassModel from "../models/Class.js";
import Student from "../models/Student.js";

// GET /api/attendance?classId=...&date=YYYY-MM-DD  (teacher/student view — single day)
export const getAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ message: "classId and date are required" });
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      classId: mongoose.Types.ObjectId(classId),
      date: { $gte: start, $lte: end },
    }).populate("studentId", "userId rollNumber");

    return res.json(records);
  } catch (error) {
    console.error("getAttendanceByDate:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance/all-classes
// Authorized: headmaster (returns array where each item is one class's summary)
export const getAllClassesAttendance = async (req, res) => {
  try {
    // Get all classes
    const classes = await ClassModel.find();
    const todayISO = new Date().toISOString().slice(0, 10);

    // Build summary for each class in parallel
    const summaries = await Promise.all(
      classes.map(async (cls) => {
        // For monthly/yearly aggregation we keep it simple and reuse your previous pipeline idea.
        const classId = new mongoose.Types.ObjectId(cls._id);

        // daily (for past 7 days) — simple example: group by date for last 1 month
        const dayStart = new Date();
        dayStart.setDate(dayStart.getDate() - 30);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date();
        dayEnd.setHours(23, 59, 59, 999);

        const monthlyPipeline = [
          { $match: { classId, date: { $gte: dayStart, $lte: dayEnd } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              present: {
                $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
              },
              total: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              date: "$_id",
              present: 1,
              total: 1,
              percentage: {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  {
                    $round: [
                      { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
                      1,
                    ],
                  },
                ],
              },
              _id: 0,
            },
          },
        ];

        const monthly = await Attendance.aggregate(monthlyPipeline);

        // yearly summary by month (last 12 months)
        const yearStart = new Date();
        yearStart.setMonth(yearStart.getMonth() - 11);
        yearStart.setDate(1);
        yearStart.setHours(0, 0, 0, 0);
        const yearEnd = new Date();
        yearEnd.setHours(23, 59, 59, 999);

        const yearlyPipeline = [
          { $match: { classId, date: { $gte: yearStart, $lte: yearEnd } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
              present: {
                $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
              },
              total: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              date: "$_id",
              present: 1,
              total: 1,
              percentage: {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  {
                    $round: [
                      { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
                      1,
                    ],
                  },
                ],
              },
              _id: 0,
            },
          },
        ];

        const yearly = await Attendance.aggregate(yearlyPipeline);

        // For daily (today) fetch today's records (optional)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const dailyPipeline = [
          { $match: { classId, date: { $gte: todayStart, $lte: todayEnd } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              present: {
                $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
              },
              total: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              date: "$_id",
              present: 1,
              total: 1,
              percentage: {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  {
                    $round: [
                      { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
                      1,
                    ],
                  },
                ],
              },
              _id: 0,
            },
          },
        ];

        const daily = await Attendance.aggregate(dailyPipeline);

        return {
          today: todayISO,
          class: {
            id: cls._id.toString(),
            name: cls.name,
            section: cls.section,
          },
          daily,
          monthly,
          yearly,
        };
      })
    );

    return res.json(summaries);
  } catch (error) {
    console.error("getAllClassesAttendance:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { classId, date, attendances } = req.body;
    const records = attendances.map((a) => ({
      classId,
      date: new Date(date),
      studentId: a.studentId,
      status: a.status,
      notes: a.notes,
    }));
    await Attendance.deleteMany({
      classId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    });
    const created = await Attendance.insertMany(records);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
