// Progress: Student academic/behavioral progress tracking
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: { type: String, required: true },
    type: {
      type: String,
      enum: ["academic", "behavioral", "attendance"],
      required: true,
    },
    score: Number, // e.g., 85/100
    date: { type: Date, default: Date.now },
    teacherComment: String,
    parentComment: String,
    goals: [String], // Next improvement goals
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
