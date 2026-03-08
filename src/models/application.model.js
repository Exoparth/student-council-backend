const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },

    domainId:{
        type:String,
        required:true
    },

    department:{
        type:String,
        required:true
    },

    rollNo:{
        type:String,
        required:true
    },

    currentYear:{
        type:Number,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    position:{
        type:String,
        required:true
    },

    statement:{
        type:String
    },

    experience:{
        type:String
    },

    kts:{
        type:Number
    },

    pointer:{
        type:Number
    },

    applicationStatus:{
        type:String,
        enum:[
            "pending",
            "accepted",
            "rejected"
        ],
        default:"pending"
    },

    interviewStatus:{
        type:String,
        enum:[
            "pending",
            "shortlisted",
            "rejected"
        ],
        default:"pending"
    },

    interviewDate:{
        type:Date
    }

},{timestamps:true})

module.exports = mongoose.model("Application",applicationSchema)