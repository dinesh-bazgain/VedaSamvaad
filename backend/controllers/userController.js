import { generateToken } from "../lib/utils.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {
  generateSalt,
  hashPassword,
  verifyPassword,
} from "../lib/authUtils.js";

// Sign up new user
export const signUp = async (req, res) => {
  const { fullName, email, password, profilePic, bio } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    // password hashing
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword, 
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({ success: false, message: "Server error", error: error.message });
  }
};

// controller to handle user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // password verification
    const isPasswordCorrect = verifyPassword(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Server error", error: error.message });
  }
};

// controller to check if user is authenticated
export const checkAuth = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// controller to update user profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    // Always include all fields in update
    const updateData = { bio, fullName };

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// deleting user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's messages
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
