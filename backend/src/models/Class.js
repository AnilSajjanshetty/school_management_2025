// models/Class.js
import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    section: String,
    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],

    // ADD THIS FIELD
    subjectTeachers: [
      {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
