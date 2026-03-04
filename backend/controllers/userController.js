const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/emailService");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Simple validation
    if (password.length < 6) return res.status(400).json({ error: "Secret Key must be >= 6 characters" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid identity (email) format" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Creation failed - please try again" });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // In frontend this might be username or email

    if (!email || !password) {
      return res.status(400).json({ error: "Identity and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }]
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    await User.findByIdAndUpdate(followerId, {
      $addToSet: { following: followingId },
    });

    await User.findByIdAndUpdate(followingId, {
      $addToSet: { followers: followerId },
    });

    return res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("followers", "username")
      .populate("following", "username");

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch profile" });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // Identity

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }]
    });
    if (!user) return res.status(404).json({ error: "No account found with this identity" });

    const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    user.resetToken = resetToken;
    await user.save();
    // Trigger local email simulation (for dev links in console)
    const emailSent = await sendResetEmail(user.email, resetToken);

    if (!emailSent) {
      console.error(`[Vault] FAILED to send email to ${user.email}`);
      return res.status(500).json({ error: "Email delivery failed. Check your App Password." });
    }

    res.status(200).json({
      message: "A secure vault code has been sent to your registered identity.",
      emailPreview: `Check backend console for dev link`
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong - please try again" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body; // identity
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
      resetToken
    });
    if (!user) return res.status(400).json({ error: "Invalid identity or vault code" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).limit(10).select("username followers following profilePic");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, bio, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username, bio, profilePic },
      { new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

module.exports = {
  createUser,
  getUsers,
  loginUser,
  followUser,
  getProfile,
  forgotPassword,
  resetPassword,
  searchUsers,
  updateProfile
};
