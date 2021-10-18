var express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs')
var router = express.Router();

router.get('/', checkNotAuthenticated, (req, res) =>{
  res.render('home-guest')
})

router.get('/profile', checkAuthenticated ,(req, res) => {
  res.render('profile')
})

router.get('/404', (req, res) => {
  res.render('404')
})

router.get('/home-dashboard', checkAuthenticated, async (req, res) => {
  try {
    const profileUser = await User.findById(req.user.id).then((names) => {
      return names
    }).catch((err) => console.log(err))
    var img = profileUser.profilePicture.data
    if (typeof img == 'undefined') {
      img = fs.readFileSync('public/default/default_profile_pic.png').toString('base64');
    } else {
      img = img.toString('base64')
    }
    Post.find({}, (err, posts) => {
      if (err) {
        res.status(500).json("No post found")
      } else {       
        res.render('home-dashboard', {blogs: posts, id: req.user.id, image:img})
      }
    }).sort({createdAt: 'desc'})
  } catch(err) {
    res.status(500).json("Error")
  }
})

router.get('/profile-new/:id', checkAuthenticated, async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const profileUser = await User.findById(req.user.id).then((names) => {
        return names
      }).catch((err) => console.log(err))
      var img = profileUser.profilePicture.data
      if (typeof img == 'undefined') {
        img = fs.readFileSync('public/default/default_profile_pic.png').toString('base64');
      } else {
        img = img.toString('base64')
      }
      Post.find({userID: req.user.id}, (err, posts) => {
        if (err) {
          res.status(500).json("No post found")
        } else {       
          res.render('profile-new', {blogs: posts, id: req.user.id, image: img})
        }
      }).sort({createdAt: 'desc'})
    } catch(err) {
      res.status(500).json(err)
    }
  } else {
    return res.status(400).send({
      message: 'This is an error!'
   });
  }
})

router.get('/create-post', checkAuthenticated, (req, res) => {
  res.render('create-post', {id: req.user.id})
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home-dashboard')
  }
  next()
}

module.exports = router;
