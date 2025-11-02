import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [String],
});

export default mongoose.model("Teacher", teacherSchema);
