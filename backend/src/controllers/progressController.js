import Progress from "../models/Progress.js";

export const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate("studentId", "name")
      .populate("classId", "name")
      .sort({ date: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
