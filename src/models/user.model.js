const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["student","admin"],
        default:"student"
    },

    profilePicture:{
        type:String,
        default:null
    },

    collegeIdCard:{
        type:String,
        default:null
    }

},{timestamps:true})

module.exports = mongoose.model("User",userSchema)