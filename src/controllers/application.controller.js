const Application = require('../models/application.model');

async function applyForCouncil(req,res){

    const studentId = req.user.id;

    const data = req.body;

    // ✅ Check if student already applied
    const existing = await Application.findOne({ student: studentId });

    if(existing){
        return res.status(400).json({
            message:"You have already applied for the council"
        })
    }

    // ✅ Create application
    const application = await Application.create({
        student:studentId,
        ...data
    })

    res.status(201).json({
        message:"Application submitted",
        application
    })
}

async function getMyApplication(req,res){

    const studentId = req.user.id;

    const application = await Application.findOne({
        student:studentId
    })

    res.json(application)
}

module.exports={
    applyForCouncil,
    getMyApplication
}