const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(user){
    return jwt.sign(
        {id:user._id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
}

async function register(req,res){

    const {fullName,email,password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const hash = await bcrypt.hash(password,10);

    const user = await User.create({
        fullName,
        email,
        password:hash
    })

    const token = generateToken(user);

    res.status(201).json({
        message:"User registered successfully",
        token,
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            role:user.role
        }
    })
}

async function login(req,res){

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const token = generateToken(user);

    res.status(200).json({
        message:"Login successful",
        token,
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            role:user.role
        }
    })
}

module.exports = {
    register,
    login
};