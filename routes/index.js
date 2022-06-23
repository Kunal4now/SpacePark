var express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
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
    let following = await User.findOne({_id: req.user.id}).select('following')
    following = following.following
    following.push(req.user.id)

    let posts = await Post.find().populate('author').sort({createdAt: 'desc'})

    let followingPosts = []

    following.forEach((user) => {
      posts.forEach((post) => {
        if (user.equals(post.author._id)) {
          followingPosts.push(post)
        }
      })
    })

    followingPosts.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

    res.render('home-dashboard', {blogs: followingPosts, id: req.user.id})
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get('/profile-new/:id', checkAuthenticated, async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const user = await User.findById(req.user.id).exec()
      Post.find({author: req.user.id}).populate('author').sort({createdAt: 'desc'}).then((doc) => {
        res.render('profile-new', {blogs: doc, id: req.user.id, user: user})
      }).catch((err) => {
        res.send(err)
      })
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

router.get('/home-dashboard/followers', async (req, res) => {
  await User.findById(req.user.id).populate('followers').then((doc) =>{
    res.render('followers', {userList: doc.followers, id: req.user.id})
  }).catch((err) => {
    if (err) {
      res.status(500).json(err)
    }
  })
})

router.get('/following', (req, res) => {
  var following = User.findById(req.user.id).populate('following').then((doc) =>{
    return doc
  }).catch((err) => {
    if (err) {
      res.status(500).json(err)
    }
  })

  res.render('following', {following: following, id: req.user.id})
})

router.get('/home-dashboard/explore', async (req, res) => {
  await User.find({_id: {$nin: req.user.following}}).then((lis) => {
    res.render('explore', {id: req.user.id, userList: lis})
  }).catch((e) => res.status(500).json(e))
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
