var express = require("express");
const bcrypt = require("bcrypt");
var User = require("../models/User");
const fs = require('fs')
const passport = require("passport");

const router = express.Router();

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/home-dashboard",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  let errors = [];
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: {
        data: fs.readFileSync('public/default/default_profile_pic.png'),
        contentType: 'image/png'
      }
    });

    if (req.body.password.length < 6) {
      errors.push({ msg: "Password should contain atleast 6 characters" });
    }

    //problem: Email already registered was not shown in error list
    //Solution: findOne need to await for to get the work done so that
    await User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already registered" });
        console.log(errors);
      }
    });
    console.log(errors);
    if (errors.length > 0) {
      res.render("home-guest", { errors });
    } else {
      user
        .save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
    }
  } catch (e) {
    console.log(e);
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
