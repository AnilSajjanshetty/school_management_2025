import Exam from "../models/Exam.js";

export const getExams = async (req, res) => {
  try {
    const { classId } = req.query;
    const exams = await Exam.find({ classId })
      .populate("classId", "name")
      .populate("results.studentId", "name");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addResults = async (req, res) => {
  try {
    const { results } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $push: { results: { $each: results } } },
      { new: true }
    ).populate("results.studentId");
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
