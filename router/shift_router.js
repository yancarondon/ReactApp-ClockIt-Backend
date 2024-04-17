const express = require("express");
const router = express.Router();
const session = require("express-session");
const Shift = require("../models/shifts");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.use(
  session({
    secret: "gtrdt54e8u54t%T%$%G5gsrg5",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  // Extract token from "Bearer <token>"
  const authToken = token.split(" ")[1];

  jwt.verify(authToken, "gtrdt54e8u54t%T%$%G5gsrg5", (err, decoded) => {
    if (err) {
      return next(err); // Pass error to error-handling middleware
    }
    req.user = decoded;
    next();
  });
}

router.post("/shifts", verifyToken, async (req, res, next) => {
  // Handle POST request for adding shifts
  // Use verifyToken middleware to authenticate the user
  try {
    const userId = req.user.id;
    // create a new shift with the user's id
    const newShift = new Shift({
      user: userId,
      clockIn: req.body.clockIn,
      clockOut: req.body.clockOut,
    });
    // Save the new shift to the database
    await newShift.save();
    res.status(200).json({ msg: "Shift added successfully", shift: newShift });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/shifts", verifyToken, async (req, res, next) => {
  // Handle GET request for retrieving shifts
  // Use verifyToken middleware to authenticate the user
  try {
    // console.log(req.user);s
    // Query MongoDB for shifts
    const shifts = await Shift.find();
    // Pass shifts as JSON response
    res.json(shifts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
