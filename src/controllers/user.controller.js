const User = require("../models/user.model");
const bcrypt = require("bcryptjs");


// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};



// CREATE USER
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};



// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
};



// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};