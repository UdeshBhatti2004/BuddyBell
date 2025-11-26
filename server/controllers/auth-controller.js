import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { upsertUser } from "../stream/stream-config.js";


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;


    if (!fullName || !email || !password ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await userModel.hashPassword(password);

    // if (gender === "male") {
    //   avatarUrl = "https://avatar.iran.liara.run/public/boy";
    // } else {
    //   avatarUrl = "https://avatar.iran.liara.run/public/girl";
    // }

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      profilePicture: "",
    });

    // 🧠 Generate JWT Token
    const token = await newUser.generateToken();

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,           
      sameSite: "strict",    
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Push user to Stream
    try {
      const user = await upsertUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePicture,
      });

    } catch (error) {
      console.error("Stream user creation failed:", error.message);
    }

    // ✅ Final response
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        isOnBoard: newUser.isOnBoard,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email or password is wrong.",
      });
    }

    const checkPassword = await user.comparePassword(password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Email or password is wrong.",
      });
    }

    const token = user.generateToken();

    // 🍪 Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const onBoarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      bio,
      profilePicture,
      nativeLanguage,
      learningLanguage,
      location,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !bio ||
      !profilePicture ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required for onboarding",
        success: false,
      });
    }

    // Update the user document
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        profilePicture,
        nativeLanguage,
        learningLanguage,
        location,
        isOnBoard: true,
      },
      { new: true }
    );

    if(!updatedUser){
      return res.status(404).json({
        success: false,
        message : "User not found."
      })
    }

    try {
      const user = await upsertUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePicture,
      });

    } catch (error) {
      console.error(error);
    }

    res.status(200).json({
      message: "User onboarded successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



