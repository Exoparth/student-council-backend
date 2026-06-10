const User = require("../models/user.model");
const Application = require("../models/application.model");
const Contact = require("../models/contact.model");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();

    // ── Application Status Breakdown ────────────────────────────────────────
    const applicationStatusRaw = await Application.aggregate([
      { $group: { _id: "$applicationStatus", count: { $sum: 1 } } },
    ]);

    // ── Interview Status Breakdown ───────────────────────────────────────────
    const interviewStatusRaw = await Application.aggregate([
      { $group: { _id: "$interviewStatus", count: { $sum: 1 } } },
    ]);

    // ── Applications by Position ─────────────────────────────────────────────
    const applicationsByPosition = await Application.aggregate([
      { $group: { _id: "$position", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // ── Applications by Department ───────────────────────────────────────────
    const applicationsByDepartment = await Application.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // ── Applications by Year ─────────────────────────────────────────────────
    const applicationsByYear = await Application.aggregate([
      { $group: { _id: "$currentYear", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // ── Applications Over Time (monthly) ─────────────────────────────────────
    const applicationsOverTime = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // ── Users Over Time (monthly) ─────────────────────────────────────────────
    const usersOverTime = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // ── CGPA / Pointer Distribution ───────────────────────────────────────────
    const pointerDistribution = await Application.aggregate([
      { $match: { pointer: { $exists: true, $ne: null } } },
      {
        $bucket: {
          groupBy: "$pointer",
          boundaries: [0, 5, 6, 7, 8, 9, 10],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // ── KTs Distribution ──────────────────────────────────────────────────────
    const ktsDistribution = await Application.aggregate([
      { $match: { kts: { $exists: true, $ne: null } } },
      { $group: { _id: "$kts", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // ── Contact Messages ──────────────────────────────────────────────────────
    const totalContacts = await Contact.countDocuments();
    const contactStatusRaw = await Contact.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // ── Acceptance Rate by Department ─────────────────────────────────────────
    const acceptanceByDept = await Application.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$applicationStatus", "accepted"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$applicationStatus", "rejected"] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // ── Helper to normalize aggregate results ─────────────────────────────────
    const normalize = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const formatTimeSeries = (arr) =>
      arr.map((item) => ({
        label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        count: item.count,
      }));

    res.json({
      summary: {
        totalUsers,
        totalApplications,
        totalContacts,
        pendingApplications: await Application.countDocuments({ applicationStatus: "pending" }),
        acceptedApplications: await Application.countDocuments({ applicationStatus: "accepted" }),
        rejectedApplications: await Application.countDocuments({ applicationStatus: "rejected" }),
        shortlistedForInterview: await Application.countDocuments({ interviewStatus: "shortlisted" }),
      },
      applicationStatus: normalize(applicationStatusRaw),
      interviewStatus: normalize(interviewStatusRaw),
      applicationsByPosition,
      applicationsByDepartment,
      applicationsByYear,
      applicationsOverTime: formatTimeSeries(applicationsOverTime),
      usersOverTime: formatTimeSeries(usersOverTime),
      pointerDistribution,
      ktsDistribution,
      contactStatus: normalize(contactStatusRaw),
      acceptanceByDept,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

module.exports = { getDashboardStats };