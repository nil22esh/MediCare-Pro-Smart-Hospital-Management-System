import mongoose from "mongoose";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  const { name, email, password, phone, gender, dob, role } = req.body;
  // Validate the request body
  if (!name || !email || !password || !phone || !gender || !dob || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    // check if user password is less than 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    // checck for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login",
      });
    }
    // create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      dob,
      role,
    });
    // save in the database
    await user.save();
    // generate jwt token
    const token = await user.generateJwtToken();
    // set cookie as HTTP only
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send sucess response
    return res.status(201).json({
      sucess: true,
      message: "User registered successfully!",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(`Error while registerUser: ${error.message}`);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Validate the request body
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    // check if user password is less than 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    // check for existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register",
      });
    }
    // check for password match
    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    // generate jwt token
    const token = await existingUser.generateJwtToken();
    // set cookie as HTTP only
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send sucess response
    return res.status(200).json({
      sucess: true,
      message: "User logged in successfully!",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    console.log(`Error while loginUser: ${error.message}`);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // check for all existing user
    const users = await User.find().select("-password -__v");
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
    // send sucess response
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.log(`Error while getAllUsers: ${error.message}`);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // clear the cookie
    res.clearCookie("jwtToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // send sucess response
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(`Error while logoutUser: ${error.message}`);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID format" });
  }
  try {
    // check for user exists
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // send sucess response
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    console.log(`Error while getUserById: ${error.message}`);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  // Validate user session
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "User ID not found, Please login!",
    });
  }
  const userId = req.user._id;
  const { name, phone, dob, role, address } = req.body;
  // Ensure at least one field is provided
  if (!name && !phone && !dob && !role && !address) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update!",
    });
  }
  try {
    // Build the update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (dob) updateFields.dob = dob;
    if (role) updateFields.role = role;
    if (address) updateFields.address = address;
    // check and update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      select: "-password -__v",
    });
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "profile not updated, try again!",
      });
    }
    // send success response
    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(`Error while updating user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID format" });
  }
  try {
    // check and delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // send success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.log(`Error while deleting user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  // Validate the request body
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "New Password is required",
    });
  }
  try {
    // check for existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register",
      });
    }
    // check if user password is less than 6 characters
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    // update password
    existingUser.password = newPassword;
    await existingUser.save();
    // generate jwt token
    const token = await existingUser.generateJwtToken();
    // send sucess response
    return res.status(200).json({
      success: true,
      message: "Password reset successful!",
      user: existingUser,
      token: token,
    });
  } catch (error) {
    console.log(`Error while forgotPassword: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
