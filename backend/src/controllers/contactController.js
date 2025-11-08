// controllers/contactController.js
import ContactMessage from "../models/ContactMessage.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const createContactMessage = async (req, res) => {
  try {
    const { type, subject, message, senderName, senderEmail, senderPhone } =
      req.body;

    if (!type || !["inquiry", "complaint", "feedback"].includes(type)) {
      return res.status(400).json({ message: "Valid type is required" });
    }
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    let studentId = null;
    let teacherId = null;

    // Auto-link if user is logged in
    if (req.user) {
      const { role, id } = req.user;

      if (role === "student") {
        const student = await Student.findOne({ userId: id });
        if (student) studentId = student._id;
      } else if (role === "teacher") {
        const teacher = await Teacher.findOne({ userId: id });
        if (teacher) teacherId = teacher._id;
      }
    }

    // Guest: require name + email
    if (!req.user && (!senderName?.trim() || !senderEmail?.trim())) {
      return res.status(400).json({
        message: "Name and email are required for guests",
      });
    }

    const contact = new ContactMessage({
      studentId,
      teacherId,
      senderName: req.user ? null : senderName?.trim(),
      senderEmail: req.user ? null : senderEmail?.trim(),
      senderPhone: senderPhone?.trim() || null,
      type,
      subject: subject?.trim() || null,
      message: message.trim(),
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, role, userId } = req.query;

    const query = {};

    // Admin filtering
    if (role && userId) {
      if (role === "student") query.studentId = userId;
      if (role === "teacher") query.teacherId = userId;
    }

    // Logged-in user sees only their messages
    if (req.user && !req.user.isAdmin) {
      const { role, id } = req.user;
      if (role === "student") {
        const student = await Student.findOne({ userId: id });
        if (student) query.studentId = student._id;
      } else if (role === "teacher") {
        const teacher = await Teacher.findOne({ userId: id });
        if (teacher) query.teacherId = teacher._id;
      }
    }

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find(query)
        .populate("studentId", "rollNumber userId")
        .populate("teacherId", "userId")
        .populate("repliedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),

      ContactMessage.countDocuments(query),
    ]);

    const enriched = messages.map((msg) => {
      let displayName = msg.senderName || "Guest";
      let displayEmail = msg.senderEmail;

      if (msg.studentId) {
        displayName = `Student #${msg.studentId.rollNumber}`;
        displayEmail = null;
      } else if (msg.teacherId) {
        displayName = "Teacher";
      }

      return {
        ...msg.toObject(),
        displayName,
        displayEmail,
      };
    });

    res.json({
      success: true,
      data: enriched,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
