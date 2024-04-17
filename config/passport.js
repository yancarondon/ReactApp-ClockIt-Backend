// Import passport-local, bcrypt and user schema
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local Strategy
  passport.use(
    // Create local strategy with email as username
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Use email to query user
          let user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          // Verify hashed password
          let isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            // Login succeeded
            return done(null, user);
          } else {
            // Login not successful
            return done(null, false, { message: "Invalid credentials" });
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  // Determines which data is saved in the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // User object attached to request under req.user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        done(null, false, { error: err });
      }
      done(err, user);
    });
  });
};
