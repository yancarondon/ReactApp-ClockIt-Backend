// ___________Imports___________
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const session = require("express-session");
// Import User Mongoose schemas
let User = require("../models/user");

// ___________Session___________
router.use(
  session({
    secret: "gtrdt54e8u54t%T%$%G5gsrg5",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

// ___________Register___________
router.post("/register", async (req, res) => {
  // Async validation check of form elements
  await check("name", "Name is required").notEmpty().run(req);
  await check("email", "Email is required").notEmpty().run(req);
  await check("phone", "Phone is required").notEmpty().run(req);
  await check("username", "Username is required").notEmpty().run(req);
  await check("email", "Email is invalid").isEmail().run(req);
  await check("password", "Password is required").notEmpty().run(req);
  await check("confirm_password", "Confirm password is required")
    .notEmpty()
    .run(req);
  await check("confirm_password", "Password and confirm password do not match")
    .equals(req.body.password)
    .run(req);
  // Get validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create new user
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // Save new user to MongoDB
    await newUser.save();
    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ___________Login___________
router.post("/login", async (req, res, next) => {
  // Check form elements are submitted and valid
  // await check("email", "Email is required").notEmpty().run(req);
  // await check("email", "Email is invalid").isEmail().run(req);
  await check("username", "Username is required").notEmpty().run(req);
  await check("password", "Password is required").notEmpty().run(req);
  // Get validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ msg: "No user found" });
  }
  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (passwordValid) {
    const token = jwt.sign({ id: user.username }, "gtrdt54e8u54t%T%$%G5gsrg5", {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  }
});

// ___________Logout___________
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ msg: "Logout successful" });
});
module.exports = router;
