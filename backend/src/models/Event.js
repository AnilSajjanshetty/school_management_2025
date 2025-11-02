import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  public: { type: Boolean, default: true },
});

export default mongoose.model("Event", eventSchema);
