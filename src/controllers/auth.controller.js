const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function register(req, res) {
  const { fullName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hash,
  });

  const token = generateToken(user);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture, // ✅ add
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture, // ✅ ADD THIS
    },
  });
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    const { fullName } = req.body;

    const updateData = {};

    if (fullName) {
      updateData.fullName = fullName;
    }

    // profile picture (optional)
    // profile picture
    if (req.files?.profilePicture) {
      const file = req.files.profilePicture[0];

      const result = await uploadFile(file.buffer.toString("base64"));

      updateData.profilePicture = result.url;
    }

    // college id card
    if (req.files?.collegeIdCard) {
      const file = req.files.collegeIdCard[0];

      const result = await uploadFile(file.buffer.toString("base64"));

      updateData.collegeIdCard = result.url;
    }
    console.log(req.files);
    console.log(req.body);

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  register,
  login,
  updateProfile,
  getMe,
};
