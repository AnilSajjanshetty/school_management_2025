// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      default: "present",
    },
    // For class-level attendance tracking
    present: Number,
    total: Number,
    remarks: String,
  },
  { timestamps: true }
);

attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true, sparse: true }
);
attendanceSchema.index({ classId: 1, date: 1 });

export default mongoose.model("Attendance", attendanceSchema);
