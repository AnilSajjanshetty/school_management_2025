import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
});

export default mongoose.model("Student", studentSchema);
