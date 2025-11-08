// models/ContactMessage.js
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    // Optional: Linked to authenticated user
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      sparse: true, // allows null + unique index if needed
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      sparse: true,
    },

    // Fallback: For guests or unlinked users
    senderName: { type: String, trim: true },
    senderEmail: { type: String, lowercase: true, trim: true },
    senderPhone: { type: String, trim: true },

    // Message details
    type: {
      type: String,
      enum: ["inquiry", "complaint", "feedback"],
      required: true,
    },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },

    // Status
    status: {
      type: String,
      enum: ["pending", "read", "resolved"],
      default: "pending",
    },

    // Optional: Admin reply
    reply: { type: String },
    repliedAt: { type: Date },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Compound index for fast lookup
contactMessageSchema.index({ studentId: 1 });
contactMessageSchema.index({ teacherId: 1 });
contactMessageSchema.index({ parentId: 1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("ContactMessage", contactMessageSchema);
