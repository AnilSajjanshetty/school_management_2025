import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  author: String,
  content: String,
  public: { type: Boolean, default: false },
});

export default mongoose.model("Testimonial", testimonialSchema);
