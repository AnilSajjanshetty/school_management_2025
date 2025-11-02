import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },
    period: { type: Number, min: 1, max: 8 },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    subject: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: String,
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
