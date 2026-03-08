const Application = require('../models/application.model');


async function getAllApplications(req,res){

    const applications = await Application.find()
        .populate("student","fullName email")

    res.json(applications)
}



async function updateApplicationStatus(req,res){

    const {status} = req.body;

    const allowedStatus = [
        "pending",
        "accepted",
        "rejected"
    ];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid application status"
        })
    }

    const updateData = {
        applicationStatus: status
    };

    // if form rejected → interview should also be rejected
    if(status === "rejected"){
        updateData.interviewStatus = "rejected";
        updateData.interviewDate = null;
    }

    const application = await Application.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new:true}
    );

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    res.json({
        message:"Application status updated",
        application
    })
}



async function scheduleInterview(req,res){

    const {date} = req.body;

    const application = await Application.findById(req.params.id);

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    if(application.applicationStatus !== "accepted"){
        return res.status(400).json({
            message:"Application must be accepted before scheduling interview"
        })
    }

    application.interviewDate = date;

    await application.save();

    res.json({
        message:"Interview scheduled",
        application
    })
}



async function updateInterviewStatus(req,res){

    const {status} = req.body;

    const allowedStatus = [
        "pending",
        "shortlisted",
        "rejected"
    ];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid interview status"
        })
    }

    const application = await Application.findByIdAndUpdate(
        req.params.id,
        {interviewStatus:status},
        {new:true}
    )

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    res.json({
        message:"Interview result updated",
        application
    })
}



module.exports={
    getAllApplications,
    updateApplicationStatus,
    scheduleInterview,
    updateInterviewStatus
}