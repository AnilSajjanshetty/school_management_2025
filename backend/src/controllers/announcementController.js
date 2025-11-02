import Announcement from "../models/Announcement.js";

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      visibility: "public",
    }).sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
