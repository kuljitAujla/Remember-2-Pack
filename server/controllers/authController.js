/* global process */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: "All fields are required"});
    }

    try {
        const existingUser = await userModel.findOne({email});

        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});

        // sending email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Remember-2-Pack',
            text: `Welcome to Remember-2-Pack. You account has been created with Email: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password) {
        return res.json({success: false, message: "All fields are required"});
    }
    
    try { 
        const user = await userModel.findOne({email});

        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success: false, message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', maxAge: 7 * 24 * 60 * 60 * 1000});
        
        return res.json({success: true});
        

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'});
        return res.json({success: true, message: "Logged out successfully"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export const sendVerfiyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const user = await userModel.findById(userId)

        if (user.isAccountVerified){
            return res.json({success: false, message: "Account is Already Verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        //expires from 1 day 
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        // sending verify email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Remember-2-Pack Account Verification',
            text: `Your OTP is ${otp}. Please verify your email using this OTP`
        }
        await transporter.sendMail(mailOptions)

        res.json({success: true, message: 'Verification OTP Sent to Email'});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'missing details'})
    } 

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found'})
        }
    
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"})
        }
    
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired"})
        }
    
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
    
        await user.save();
        return res.json({ success: true, message: "Email verified sucessfully!"})

    } catch (error) {
        return res.json({ success: false, message: error.message})
    }
}

// checks if user is authentication
export const isAuthenticated = async (req, res) => {
    try {
        res.json({success: true})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// password reset otp 
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({success: false, message: "email is required"})
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success: false, message: "user not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        //expires in 15 mins
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Remember-2-Pack Password Reset',
            text: `Your OTP to change your password is ${otp}. Use this OTP to proceed with resetting your password.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: "OTP sent to email"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//reset pass
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({success: false, message: "Please add all fields"})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "user not found"})
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({success: false, message: "Incorrect OTP"})
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({success: true, message: "Password has been reset successfully."})


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
    
}