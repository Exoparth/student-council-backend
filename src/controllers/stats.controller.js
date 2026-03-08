const User = require("../models/user.model");
const Application = require("../models/application.model");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};