const Application = require("../models/application.model");

async function applyForCouncil(req,res){

  const studentId = req.user.id;
  const { position } = req.body;

  const applications = await Application.find({
    student: studentId
  });

  // Max 3 applications
  if(applications.length >= 3){
    return res.status(400).json({
      message:"You can apply for maximum 3 positions only"
    });
  }

  // Prevent duplicate position
  const alreadyApplied = applications.find(
    app => app.position.toLowerCase() === position.toLowerCase()
  );

  if(alreadyApplied){
    return res.status(400).json({
      message:"You already applied for this position"
    });
  }

  const application = await Application.create({
    student:studentId,
    ...req.body
  });

  res.status(201).json({
    message:"Application submitted",
    application
  });

}

async function getMyApplication(req,res){

  const studentId = req.user.id;

  const applications = await Application.find({
    student:studentId
  });

  res.json(applications);
}

module.exports = {
  applyForCouncil,
  getMyApplication
};