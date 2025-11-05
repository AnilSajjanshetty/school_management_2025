import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    type: {
      type: String,
      enum: ["academic", "behavioral", "attendance"],
      required: true,
    },
    score: Number,
    date: { type: Date, default: Date.now },
    teacherComment: String,
    parentComment: String,
    goals: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
