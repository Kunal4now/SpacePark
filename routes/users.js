var express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update password
router.put("/:id/update", async (req, res) => {
  if (req.user.id === req.params.id) {
    console.log(req.user.id, req.params.id)
    try {
      console.log("req.body.password", req.body.password)
      if (req.body.password.length >= 6) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        }, {new: true});
        res.status(200).json(updatedUser)
      } else {
        res.status(401).json("Password should contain atleast 6 characters");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account");
  }
});

module.exports = router;
