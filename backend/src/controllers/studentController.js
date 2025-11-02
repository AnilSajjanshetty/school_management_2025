import Student from "../models/Student.js";

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("classId", "name section");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
