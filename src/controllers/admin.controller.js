const Application = require('../models/application.model');
const sendEmail = require("../services/email.service");

async function getAllApplications(req,res){

    const applications = await Application.find()
        .populate("student","fullName email")

    res.json(applications)
}



async function updateApplicationStatus(req,res){

    const {status} = req.body;

    const allowedStatus = ["pending","accepted","rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid application status"
        })
    }

    const updateData = {
        applicationStatus: status
    };

    if(status === "rejected"){
        updateData.interviewStatus = "rejected";
        updateData.interviewDate = null;
    }

    const application = await Application.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new:true}
    ).populate("student");

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    const email = application.student.email;
    const name = application.student.fullName;

    if(status === "accepted"){

        await sendEmail(
            email,
            "Application Approved",
            `
            <h2>Hello ${name}</h2>
            <p>Your application for <b>${application.position}</b> has been <b>approved</b>.</p>
            <p>You will soon receive interview details.</p>
            `
        );

    }

    if(status === "rejected"){

        await sendEmail(
            email,
            "Application Rejected",
            `
            <h2>Hello ${name}</h2>
            <p>We regret to inform you that your application for <b>${application.position}</b> has been rejected.</p>
            <p>Thank you for applying.</p>
            `
        );

    }

    res.json({
        message:"Application status updated",
        application
    })
}



async function scheduleInterview(req,res){

    const {date} = req.body;

    const application = await Application.findById(req.params.id)
        .populate("student");

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

    const email = application.student.email;
    const name = application.student.fullName;

    await sendEmail(
        email,
        "Interview Scheduled",
        `
        <h2>Hello ${name}</h2>
        <p>Your interview for <b>${application.position}</b> has been scheduled.</p>
        <p><b>Date:</b> ${new Date(date).toDateString()}</p>
        `
    );

    res.json({
        message:"Interview scheduled",
        application
    })
}



async function updateInterviewStatus(req,res){

    const {status} = req.body;

    const allowedStatus = ["pending","shortlisted","rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid interview status"
        })
    }

    const application = await Application.findByIdAndUpdate(
        req.params.id,
        {interviewStatus:status},
        {new:true}
    ).populate("student");

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    const email = application.student.email;
    const name = application.student.fullName;

    if(status === "shortlisted"){

        await sendEmail(
            email,
            "Congratulations 🎉",
            `
            <h2>Hello ${name}</h2>
            <p>Congratulations! You have been <b>selected</b> for the position of <b>${application.position}</b>.</p>
            `
        );

    }

    if(status === "rejected"){

        await sendEmail(
            email,
            "Interview Result",
            `
            <h2>Hello ${name}</h2>
            <p>Unfortunately you were not selected for the position of <b>${application.position}</b>.</p>
            `
        );

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