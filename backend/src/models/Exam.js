import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    totalMarks: { type: Number, default: 100 },
    room: String,
    results: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        marksObtained: Number,
        grade: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
