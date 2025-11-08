import Timetable from "../models/Timetable.js";

export const getTimetables = async (req, res) => {
  try {
    const { classId } = req.query;
    const timetables = await Timetable.find({ classId })
      .populate("teacherId", "name")
      .populate("classId", "name")
      .sort({ day: 1, period: 1 });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTimetable = async (req, res) => {
  try {
    const tt = await Timetable.create(req.body);
    const populated = await tt.populate("teacherId classId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllClassTimetables = async (req, res) => {
  try {
    // Step 1: Get all timetable entries with populated data
    const timetables = await Timetable.find({})
      .populate("classId", "name section")
      .populate("teacherId", "name")
      .populate("subjectId", "name code")
      .sort({ "classId.name": 1, day: 1, period: 1 });

    if (!timetables.length) {
      return res.json({ message: "No timetables found", data: [] });
    }

    // Step 2: Group by class
    const grouped = {};

    timetables.forEach((entry) => {
      const classKey = `${entry.classId._id}`;
      const className = `${entry.classId.name} ${
        entry.classId.section || ""
      }`.trim();

      if (!grouped[classKey]) {
        grouped[classKey] = {
          classId: entry.classId._id,
          className,
          timetable: {},
        };
      }

      const day = entry.day;
      if (!grouped[classKey].timetable[day]) {
        grouped[classKey].timetable[day] = [];
      }

      grouped[classKey].timetable[day].push({
        period: entry.period,
        subject: entry.subjectId.name,
        subjectCode: entry.subjectId.code,
        teacher: entry.teacherId.name,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room || "-",
      });
    });

    // Step 3: Convert to array and sort periods
    const result = Object.values(grouped).map((cls) => {
      const sortedTimetable = {};
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      days.forEach((day) => {
        if (cls.timetable[day]) {
          sortedTimetable[day] = cls.timetable[day].sort(
            (a, b) => a.period - b.period
          );
        }
      });

      return {
        classId: cls.classId,
        className: cls.className,
        timetable: sortedTimetable,
      };
    });

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching all timetables:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
