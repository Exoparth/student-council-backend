const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
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
    enum:["pending","accepted","rejected"],
    default:"pending"
  },

  interviewStatus:{
    type:String,
    enum:["pending","shortlisted","rejected"],
    default:"pending"
  },

  interviewDate:{
    type:Date
  }

},{timestamps:true})


// ✅ Prevent same student applying same position twice
applicationSchema.index(
  { student: 1, position: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application",applicationSchema);