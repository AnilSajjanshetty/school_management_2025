import Teacher from "../models/Teacher.js";

// src/controllers/teacherController.js or wherever your route is
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.aggregate([
      // 1. Lookup User to get name
      {
        $lookup: {
          from: "users", // Collection name (lowercase, plural)
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // 2. Lookup Subjects to get subject names
      {
        $lookup: {
          from: "subjects", // Collection name
          localField: "subjects",
          foreignField: "_id",
          as: "subjectDetails",
        },
      },

      // 3. Project only what we need
      {
        $project: {
          id: "$_id",
          name: { $ifNull: ["$user.name", "Unknown User"] },
          subjects: {
            $map: {
              input: "$subjectDetails",
              as: "subj",
              in: "$$subj.name",
            },
          },
          _id: 0,
        },
      },
    ]);

    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
