const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt')
const User = require('../models/User');
router.use(express.urlencoded({extended: false}))

router.get('/:id', async (req, res) => {
    if (req.user.id === req.params.id) {
      try {
        Post.find({userID: req.user.id}, (err, posts) => {
          if (err) {
            res.status(500).json("No post found")
          } else {       
            res.render('profile-new', {blogs: posts, id: req.user.id, image: ProfilePic.data.toString('base64')})
          }
        }).sort({createdAt: 'desc'})
      } catch(err) {
        res.status(500).json("Error")
      }
    } else {
      return res.status(400).send({
        message: 'This is an error!'
     });
    }
  })

//update password
router.post('/:username/update', (req, res) => {
    
    User.findById(req.session.passport.user).then((user) => {
        res.json(req.params);
    }).catch((err => console.log(err)))
})

router.put('/:id/update', async (req, res) => {
    if (req.user.id === req.params.id) {
        if (await bcrypt.compare(req.body.oldPassword, req.user.password)) {
            
        }
        try {
             if (req.body.password.length >= 6) {
                const pass = await bcrypt.hash(req.body.password, 10);
             }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json("You can update only your account")
    }
})

router.get('/:id/edit', (req, res) => {
    res.render('edit-profile')
})

module.exports = router;