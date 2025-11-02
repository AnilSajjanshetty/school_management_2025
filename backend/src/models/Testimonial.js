import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  author: String,
  content: String,
  public: { type: Boolean, default: true },
});

export default mongoose.model("Testimonial", testimonialSchema);
