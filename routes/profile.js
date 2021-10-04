var express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt')
const User = require('../models/User');
router.use(express.urlencoded({extended: false}))

//update password
router.post('/:username/update', (req, res) => {
    
    User.findById(req.session.passport.user).then((user) => {
        res.json(req.params);
    }).catch((err => console.log(err)))
})

router.put('/:id/update', async (req, res) => {
    if (req.user.id === req.params.id) {
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

module.exports = router;