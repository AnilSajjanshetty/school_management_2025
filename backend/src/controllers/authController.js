import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedUsers = async (req, res) => {
  const users = [
    {
      name: "Headmaster Raj",
      email: "head@brightpath.com",
      password: "123456",
      role: "headmaster",
    },
    {
      name: "Ms. Anita",
      email: "anita@brightpath.com",
      password: "123456",
      role: "class_teacher",
    },
    {
      name: "Mr. Kumar",
      email: "kumar@brightpath.com",
      password: "123456",
      role: "teacher",
    },
    {
      name: "Priya Sharma",
      email: "priya@brightpath.com",
      password: "123456",
      role: "student",
    },
  ];

  try {
    await User.deleteMany({});
    const hashed = users.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, 10),
    }));
    const created = await User.insertMany(hashed);
    res.json({ message: "Users seeded", count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
