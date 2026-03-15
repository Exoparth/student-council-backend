const Application = require("../models/application.model");
const sendEmail = require("../services/email.service");
const emailTemplate = require("../services/emailTemplate.service");

async function getAllApplications(req, res) {
  const applications = await Application.find().populate(
    "student",
    "fullName email",
  );

  res.json(applications);
}

async function updateApplicationStatus(req, res) {
  const { status } = req.body;

  const allowedStatus = ["pending", "accepted", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid application status",
    });
  }

  const updateData = {
    applicationStatus: status,
  };

  if (status === "rejected") {
    updateData.interviewStatus = "rejected";
    updateData.interviewDate = null;
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true },
  ).populate("student");

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  const email = application.student.email;
  const name = application.student.fullName;

  if (status === "accepted") {
    await sendEmail(
      email,
      "Application Approved",
      emailTemplate({
        title: "Application Approved",
        statusColor: "#22c55e",
        message: `
      Hello <b>${name}</b>,<br/><br/>
      Your application for <b>${application.position}</b> has been approved.
      <br/><br/>
      You will soon receive interview details.
    `,
      }),
    );
  }

  if (status === "rejected") {
    await sendEmail(
      email,
      "Application Rejected",
      emailTemplate({
        title: "Application Rejected",
        statusColor: "#ef4444",
        message: `
      Hello <b>${name}</b>,<br/><br/>
      We regret to inform you that your application for 
      <b>${application.position}</b> has been rejected.
      <br/><br/>
      Thank you for applying.
    `,
      }),
    );
  }

  res.json({
    message: "Application status updated",
    application,
  });
}

async function scheduleInterview(req, res) {
  const { date } = req.body;

  const application = await Application.findById(req.params.id).populate(
    "student",
  );

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  if (application.applicationStatus !== "accepted") {
    return res.status(400).json({
      message: "Application must be accepted before scheduling interview",
    });
  }

  application.interviewDate = date;

  await application.save();

  const email = application.student.email;
  const name = application.student.fullName;

  await sendEmail(
    email,
    "Interview Scheduled",
    emailTemplate({
      title: "Interview Scheduled",
      statusColor: "#f59e0b",
      message: `
      Hello <b>${name}</b>,<br/><br/>
      Your interview for <b>${application.position}</b> has been scheduled.
      <br/><br/>
      <b>Date:</b> ${new Date(date).toDateString()}
    `,
    }),
  );

  res.json({
    message: "Interview scheduled",
    application,
  });
}

async function updateInterviewStatus(req, res) {
  const { status } = req.body;

  const allowedStatus = ["pending", "shortlisted", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid interview status",
    });
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { interviewStatus: status },
    { new: true },
  ).populate("student");

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  const email = application.student.email;
  const name = application.student.fullName;

  if (status === "shortlisted") {
    await sendEmail(
      email,
      "Congratulations 🎉",
      emailTemplate({
        title: "Congratulations!",
        statusColor: "#22c55e",
        message: `
      Hello <b>${name}</b>,<br/><br/>
      Congratulations! You have been selected for the position of 
      <b>${application.position}</b>.
    `,
      }),
    );
  }

  if (status === "rejected") {
    await sendEmail(
      email,
      "Interview Result",
      `
            <h2>Hello ${name}</h2>
            <p>Unfortunately you were not selected for the position of <b>${application.position}</b>.</p>
            `,
    );
  }

  res.json({
    message: "Interview result updated",
    application,
  });
}

module.exports = {
  getAllApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewStatus,
};
