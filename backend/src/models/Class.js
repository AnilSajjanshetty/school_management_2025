import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

export default mongoose.model("Class", classSchema);
