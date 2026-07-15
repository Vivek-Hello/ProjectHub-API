import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (id) =>{
    const accessToken = jwt.sign({id},process.env.ACCESS_TOKEN,{expiresIn:'15m'});
    return accessToken;
}

const generateRefreshToken = (id) =>{
    const refreshToken = jwt.sign({id},process.env.REFRESH_TOKEN,{expiresIn:'7d'});
    return refreshToken;
}

const accessCookieOptions = {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

const refreshCookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

export const registerUser = async (req,res) => {
    try {
        const {username,email,password} = req.body;
        if (!username || !email || !password) return res.status(400).json({message:"Missing credentials"});

        const userExist = await User.findOne({email});
        if (userExist) return res.status(409).json({message:"User already exist try to login"});

        const hashedPassword = await bcrypt.hash(password,10);

        username = username.trim();
        email = email.trim().toLowerCase();
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({success: true,message: "User registered successfully"});
    } catch (err) {
        console.error("Server error :" ,err);
        return res.status(500).json({message:"Server error at signup"});
    }
};


export const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        if (!email || !password) return res.status(400).json({message:"Missing credentials"});

        email = email.trim().toLowerCase();

        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isValidPassword = await bcrypt.compare(password,user.password);
        if (!isValidPassword) return res.status(400).json({message:"Invalid credentials"});

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('accesstoken',accessToken,accessCookieOptions);
        res.cookie('refreshtoken',refreshToken,refreshCookieOptions);

        return res.status(200).json({message:"Login successful",success:true,user:{username:user.username,_id:user._id,email:user.email}});
    } catch (err) {
        console.error("Server error :" ,err);
        return res.status(500).json({message:"Server error at login"});
    }
};