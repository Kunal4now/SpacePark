var express = require('express');
const bcrypt = require('bcrypt');
var User = require('../models/User')
const db = require('../db')
const router = express.Router();

router.post('/register', async (req, res) => {
  let errors = []
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })
    
    if (req.body.password.length < 6) {
      errors.push({msg: 'Password should contain atleast 6 characters'})
    }
    
    //problem: Email already registered was not shown in error list
    //Solution: findOne need to await for to get the work done so that
    await User.findOne({email: req.body.email}).then(user => {
      if (user) {
        errors.push({msg: 'Email already registered'})
        console.log(errors)
      } 
    });
    console.log(errors);
    if (errors.length > 0) {
      res.render('home-guest', {errors})
    } else {
      user.save().then((result) => res.send(result)).catch((err) => console.log(err))
    }
  } catch(e) {
    console.log(e)
  }
})

module.exports = router;
