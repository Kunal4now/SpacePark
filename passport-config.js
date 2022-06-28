const bcrypt = require("bcryptjs");
const User = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    console.log(email);
    User.findOne({ email: email })
      .then(async (user) => {
        if (!user) {
          console.log("errr");
          return done(null, false, { message: "No user with that email" });
        }
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user, { message: "Sucess" });
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      })
      .catch((err) => console.log(err));
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "loginEmail", passwordField: "loginPassword" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = initialize;


