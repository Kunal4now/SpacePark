var express = require("express");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const multer = require("multer");
const fs = require('fs')

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return "error: images only";
  }
};

const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jfif)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

router.get("/:id/edit", (req, res) => {
  res.render("edit-profile.ejs", { id: req.user.id });
});

//update profile
router.post(
  "/:id/updateProfile",
  upload.single("image"),
  async (req, res) => {
    try {
      // console.log(req.file);
      var newProfilePic = fs.readFileSync(`public/images/${req.file.filename}`)
      const img = {
        data: newProfilePic,
        contentType: 'image/png'
      }
      const updatedUser =  await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            profilePicture: img
          }
        }, {new: true}
      )
      // console.log(updatedUser)
      // console.log(newProfilePic)
      await fs.unlink(`public/images/${req.file.filename}`, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log("File deleted sucessfully")
        }
      })
      res.render("edit-profile", {
        file: newProfilePic,
        id: req.user.id,
        image: updatedUser.profilePicture.data.toString('base64')
      });
    } catch(e) {
      console.log(e)
    }
  },
  (error, req, res, next) => {
    res.status(400).json(error.message);
  }
);

//update password
router.put("/:id/update", async (req, res) => {
  if (req.user.id === req.params.id) {
    console.log(req.user.id, req.params.id);
    try {
      console.log("req.body.password", req.body.password);
      if (req.body.password.length >= 6) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
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
