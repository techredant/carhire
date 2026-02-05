// routes/user.routes.js
const express = require("express");
const dotenv = require("dotenv");
const User = require("../models/user"); 
require("dotenv").config();

const router = express.Router();

// ------------------- CREATE OR UPDATE USER -------------------
router.post("/create-user", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Missing firstName or lastName" });
    }

    let user = await User.findOne({ firstName });

    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      await user.save();
      return res
        .status(200)
        .json({ success: true, user, message: "User updated" });
    }

    user = await User.create({
      firstName: firstName || "",
      lastName: lastName || "",
    });

    res.status(201).json({ success: true, user, message: "User created" });
  } catch (err) {
    console.error("Error creating/updating user:", err);
    // return detailed message for debugging (remove stack in production)
    res
      .status(500)
      .json({ message: "Server error", error: err.message, code: err.code });
  }
});




// ------------------- GET USER BY firstName -------------------
router.get("/:firstName", async (req, res) => {
  try {
    const { firstName } = req.params;
    const user = await User.findOne({ firstName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- GET ALL USERS -------------------
router.get("/", async (req, res) => {
  try {
    const { firstName } = req.query; // 👈 current logged-in user's Clerk ID (optional)

    const users = await User.find();

    // If no logged-in user provided, return all users
    if (!firstName) {
      return res.json(users);
    }

    // Get the current user for following info
    const currentUser = await User.findOne({ firstName });

    const data = users.map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      firstName: u.firstName,
      lastName: u.lastName,
          }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error fetching users" });
  }
});

module.exports = router;
