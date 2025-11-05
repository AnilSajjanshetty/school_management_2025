import Class from "../models/Class.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("classTeacherId", "name");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const cls = await Class.create(req.body);
    res.status(201).json(cls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
