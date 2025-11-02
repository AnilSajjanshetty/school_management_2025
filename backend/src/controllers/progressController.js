import Progress from "../models/Progress.js";

export const getProgress = async (req, res) => {
  try {
    const { studentId } = req.query;
    const progress = await Progress.find({ studentId })
      .populate("studentId", "name")
      .populate("classId", "name")
      .sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgress = async (req, res) => {
  try {
    const p = await Progress.create(req.body);
    const populated = await p.populate("studentId classId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
