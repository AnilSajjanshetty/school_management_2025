import User from "../models/User.js";

/**
 * @desc Create a new user
 * @route POST /api/users
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, profilePic } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
      address,
      profilePic,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Server error while creating user." });
  }
};

/**
 * @desc Get all users
 * @route GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

/**
 * @desc Get a single user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error while fetching user." });
  }
};

/**
 * @desc Update user by ID
 * @route PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
};

/**
 * @desc Delete user by ID
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user." });
  }
};
