const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const authRoute = require("../utils/authRoute");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, phon_number, password } = req.body;

    // Validation
    if (!name || !phon_number || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check existing user
    const existingUser = await User.findOne({ phon_number });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      phon_number,
      password: hashedPassword,
    });

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phon_number: user.phon_number,
      token,
    });
  } catch (err) {
    console.log("Error message in Sign up :", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phon_number, password } = req.body;

    // Check user exists
    const user = await User.findOne({ phon_number });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      _id: user._id,
      name: user.name,
      phon_number: user.phon_number,
      token,
    });
  } catch (err) {
    console.log("Error message in login :", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log("Error message in get user :", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
