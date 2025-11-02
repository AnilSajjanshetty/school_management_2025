import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: { type: Date, required: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
    notes: String,
  },
  { timestamps: true }
);

attendanceSchema.index({ classId: 1, date: 1, studentId: 1 });

export default mongoose.model("Attendance", attendanceSchema);
