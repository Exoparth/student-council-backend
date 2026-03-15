const express = require("express");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/role.middleware");

const {
  getAllApplications,
  scheduleInterview,
  updateInterviewStatus,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/applications", auth, isAdmin, getAllApplications);

router.put("/status/:id", auth, isAdmin, updateApplicationStatus);

router.put("/schedule/:id", auth, isAdmin, scheduleInterview);

router.put("/interview-status/:id", auth, isAdmin, updateInterviewStatus);

router.delete('/application/:id', auth, isAdmin, deleteApplication);

module.exports = router;
