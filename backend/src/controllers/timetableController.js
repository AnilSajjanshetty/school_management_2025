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
