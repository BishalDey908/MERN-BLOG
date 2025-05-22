const usermodel = require("../models/user.models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");

//register user
const userRegServices = async (userData) => {
  const { username, email, password } = userData;

  try {
    // Validate input
    if (!username || !email || !password) {
      //   throw new Error("All fields are required");
      return { success: false, message: "All fields are required" };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
        field: "email",
      };
    }

    // Password validation
    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
        field: "password",
      };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {
        success: false,
        message: "Password must contain at least one special character",
        field: "password",
      };
    }

    // Hash password
    const hash = bcrypt.hashSync(password, saltRounds);
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create user first (to avoid sending OTP if registration fails)
    const response = await usermodel.create({
      username,
      email,
      password: hash,
      otp,
    });

    const userResponse = {
      username: response.username,
      email: response.email,
      userId: response._id, // or user.userId depending on your schema
    };

    // Configure transporter (move this outside the function in production)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Registration",
      html: `
        <h1>Your Verification Code</h1>
        <p>Please use the following OTP to complete your registration:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    // Send email with promise
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email sending error:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });

    return {
      success: true,
      data: userResponse,
      message: "User registered successfully. OTP sent to email.",
    };
  } catch (err) {
    console.error("Registration error:", err);

    let errorMessage = "Registration failed";
    let field = null;

    if (err.code === 11000) {
      if (err.keyPattern.username) {
        errorMessage = "Username already exists";
        field = "username";
      } else if (err.keyPattern.email) {
        errorMessage = "Email already exists";
        field = "email";
      }
    } else if (err.errors) {
      const firstError = Object.values(err.errors)[0];
      errorMessage = firstError.message;
      field = firstError.path;
    }

    return {
      success: false,
      message: errorMessage,
      field: field,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
  }
};

const verifyOTPServices = async (data) => {
  try {
    const { otp } = data;

    if (!otp) {
      return { success: false, message: "OTP is required" };
    }

    if(otp.length <4){
        return { success: false, message: "Enter valid otp" };
    }

    // First check if user exists with this OTP
    const user = await usermodel.findOne({ otp,isVerified:false });
    
    if (!user) {
      return { success: false, message: "User is already verified" };
    }

    // Check if already verified
    // if (user.isVerified) {
    //   return { 
    //     success: false, 
    //     message: "User is already verified",
    //     isAlreadyVerified: true 
    //   };
    // }

    // Optional: Check OTP expiration (if you have otpCreatedAt field)
    if (user.otpCreatedAt && new Date() > new Date(user.otpCreatedAt.getTime() + 10 * 60 * 1000)) {
      return { success: false, message: "OTP has expired" };
    }

    // Update the user
    const updatedUser = await usermodel.findByIdAndUpdate(
      user._id,
      { 
        isVerified: true,
        verifiedAt: new Date(),
        otp: null,
        otpCreatedAt: null 
      },
      { new: true, select: '_id username email isVerified' }
    );

    return {
      success: true,
      data: updatedUser,
      message: "OTP verified successfully, Please Login",
    };
  } catch (err) {
    console.error("Error in verifyOTPServices:", err);
    return { 
      success: false, 
      message: "OTP verification failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    };
  }
};

//login
const loginService = async(userData) => {
  const { email, password } = userData;
  if(!email || !password){
    return {success: false, message: "Require All Fields" };
  }
  const verifyUser = await usermodel.findOne({ email });
  if (verifyUser) {
      const match = bcrypt.compare(password, verifyUser.password);
      if(match){
        return {success: true, message: "Login Success" };
      }else{
        return {success: false, message: "Invalid Credentials" };
      }
  } else {
    return {success: false, message: "User not found" };
  }
};

module.exports = {
  userRegServices,
  verifyOTPServices,
  loginService,
};
