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

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.json({
            success: false, 
            message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        });
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

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: process.env.NODE_ENV === 'production' ? '.remember2pack.com' : undefined
        });

        // sending email
        const mailOptions = {
            from: process.env.SENDER_EMAIL_WELCOME,
            to: email,
            subject: 'Welcome to Remember-2-Pack',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">🎒 Remember-2-Pack</h1>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 16px;">Never forget your essentials again!</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <h2 style="color: #27ae60; margin: 0 0 20px 0; font-size: 24px;">Welcome aboard! 🎉</h2>
                    <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0;">
                        Your account has been successfully created with email: <strong>${email}</strong>
                    </p>
                </div>
                
                <div style="background-color: #ecf0f1; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="color: #2c3e50; margin: 0; font-size: 14px;">
                        <strong>Next steps:</strong><br>
                        1. Check your email for verification code<br>
                        2. Verify your account<br>
                        3. Start packing smart! 🚀
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                    <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                        Thank you for choosing Remember-2-Pack!<br>
                    </p>
                </div>
            </div>
        </div>
    `
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
            return res.json({success: false, message: "Invalid Email or Password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success: false, message: "Invalid Email or Password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: process.env.NODE_ENV === 'production' ? '.remember2pack.com' : undefined
        });
        
        return res.json({success: true});
        

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            domain: process.env.NODE_ENV === 'production' ? '.remember2pack.com' : undefined
        });
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
        user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        // sending verify email
        const mailOptions = {
            from: process.env.SENDER_EMAIL_OTP_VERIFY,
            to: user.email,
            subject: 'Remember-2-Pack Account Verification',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">🎒 Remember-2-Pack</h1>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <h2 style="color: #3498db; margin: 0 0 20px 0; font-size: 24px;">Verify Your Account 🔐</h2>
                    <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0;">
                        Please use the following code to verify your email address:
                    </p>
                </div>
                
                <div style="background-color: #3498db; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                    <p style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                    </p>
                </div>
                
                <div style="background-color: #ecf0f1; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="color: #e74c3c; margin: 0; font-size: 14px; font-weight: bold;">
                        ⚠️ This code expires in 24 hours
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                    <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                        If you didn't request this verification, please ignore this email.
                    </p>
                </div>
            </div>
        </div>
    `
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
    
        if (user.verifyOtpExpiry < Date.now()) {
            return res.json({ success: false, message: "OTP Expired"})
        }
    
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = 0;
    
        await user.save();
        return res.json({ success: true, message: "Email verified sucessfully!"})

    } catch (error) {
        return res.json({ success: false, message: error.message})
    }
}

// checks if user is authentication
export const isAuthenticated = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({success: false, message: "User ID not found"});
        }
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }
        
        if (!user.isAccountVerified) {
            return res.json({success: false, message: "Account not verified. Please verify your email to access the app."});
        }
        
        res.json({success: true, message: "User is authenticated and verified"});

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
        user.resetOtpExpiry = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL_OTP_RESET,
            to: user.email,
            subject: 'Remember-2-Pack Password Reset',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">🎒 Remember-2-Pack</h1>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <h2 style="color: #e74c3c; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password 🔑</h2>
                    <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0;">
                        Use the following code to reset your password:
                    </p>
                </div>
                
                <div style="background-color: #e74c3c; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                    <p style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                    </p>
                </div>
                
                <div style="background-color: #ecf0f1; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="color: #e74c3c; margin: 0; font-size: 14px; font-weight: bold;">
                        ⚠️ This code expires in 15 minutes
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                    <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                        If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                    </p>
                </div>
            </div>
        </div>
    `
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

        if (user.resetOtpExpiry < Date.now()) {
            return res.json({success: false, message: "OTP expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiry = 0;
        await user.save();

        return res.json({success: true, message: "Password has been reset successfully."})


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
    
}