const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

//Add schema to server
const User = require("./models/user.js");
const Shift = require("./models/shifts.js");

const user_routes = require("./router/user_router.js");
const shiftRoutes = require("./router/shift_router.js");
const config = require("./config/db_config.js");
const session = require("express-session");
const passport = require("passport");
require("./config/passport.js")(passport);

// Adding Mongoose and connecting to MongoDB
const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/clockitdb"); //name is based on DB name
mongoose.connect(process.env.MONGODB || config.mongodb);
// mongoose.connect(config.database);
const db = mongoose.connection;

db.once("open", function () {
  console.log("Connected to MongoDB");
});

db.on("error", function (err) {
  console.log("DB Error");
});

//Middleware/configuring the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/user", user_routes);
app.use("/shifts", shiftRoutes);

// Initialize session
app.use(
  session({
    secret: "gtrdt54e8u54t%T%$%G5gsrg5",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);
require("./config/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
