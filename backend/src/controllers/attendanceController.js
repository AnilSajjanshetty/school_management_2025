import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;
    const start = new Date(date);
    const end = new Date(new Date(date).setHours(23, 59, 59));
    const records = await Attendance.find({
      classId,
      date: { $gte: start, $lte: end },
    }).populate("studentId", "name");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
