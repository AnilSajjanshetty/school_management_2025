import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    rollNumber: Number,
    admissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
