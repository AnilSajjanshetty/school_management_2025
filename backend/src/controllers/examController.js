import Exam from "../models/Exam.js";

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("classId", "name section")
      .populate("results.studentId", "name");

    if (!exams.length) {
      return res.status(404).json({ message: "No exams found" });
    }

    console.log("✅ Exams fetched:", exams.length);
    res.status(200).json(exams);
  } catch (err) {
    console.error("❌ Error fetching exams:", err);
    res.status(500).json({ message: err.message });
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
