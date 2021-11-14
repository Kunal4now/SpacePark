var express = require("express");
const { route } = require(".");
const User = require("../models/User");
const router = express.Router()

router.put('/explore/:id/follow', async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(403).json("You cannot follow yourself")
    }
    else {
        try {
            await User.findByIdAndUpdate(
                req.user.id, 
                {$push: {following: req.params.id}}
            ).catch((er) => res.status(500).json(er))
            await User.findByIdAndUpdate(
                req.params.id,
                {$push: {followers : req.user.id}}
            ).catch((e) => res.status(500).json(e))
            res.redirect(`/home-dashboard/explore`)
        } catch(e) {
            res.status(500).json(e)
        }
    }
})

router.delete('/explore/:id/unfollow', async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(403).json("You cannot unfollow yourself")
    }
    else {
        try {
            await User.findByIdAndUpdate(
                req.user.id,
                {$pull: {following: req.params.id}}
            ).catch((e) => res.status(500).status(e))
            res.redirect('/home-dashboard/following')
        } catch(e) {
            res.status(500).json(e)
        }
    }
})

router.delete('/explore/:id/remove', async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(403).json(403)
    }
    else {
        try {
            await User.findByIdAndUpdate(
                req.user.id,
                {$pull: {followers: req.params.id}}
            ).catch((err) => res.status(500).json(err))
            await User.findByIdAndUpdate(
                req.params.id,
                {$pull: {following: req.user.id}}
            ).catch((err) => res.status(500).json(err))
            res.redirect('/home-dashboard/followers')
        } catch(err) {
            res.status(500).json(err)
        }
    }
})

router.get('/following', async (req, res) => {
    try {
        await User.find({_id: {$in: req.user.following}}).then((lis) => {
            res.render('following', {id: req.user.id, userList: lis})
          }).catch((e) => res.status(500).json(e))
    } catch (e) {
        res.status(500).json(e)
    }
})

router.get('/followers', async (req, res) => {
    await User.find(
        {following : {$in: req.user.id}}
    ).then((lis) => {
        res.render('followers', {id: req.user.id, userList: lis})
    }).catch((e) => res.status(500).json(e))
})


module.exports = router