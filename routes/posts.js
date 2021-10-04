var express = require('express');
var router = express.Router();
const Post = require('../models/Post')
const url = require('url')

router.post('/create', async (req, res) => {
    const post = new Post({
        userID: req.user.id,
        author: req.user.username,
        title: req.body.title,
        description: req.body.description,
        snippet: req.body.snippet
    })
    try {
        const savedPost = await post.save()
        res.redirect(`/posts/${savedPost.id}`)
        // res.render('single-post-screen', {post: savedPost})
        // res.status(200).json(savedPost)
    } catch(err) {
        res.status(500).json(err)
    }
})

router.get('/find', async (req, res) => {
    try {
        Post.find({userID: req.user.id}, (error, doc) => {
            if (error) {
                res.status(500).json(error)
                // console.log(err)
            } else {
                console.log(doc)
                res.status(200).json(doc)
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        Post.findById(req.params.id, (error, doc) => {
            if (error) {
                res.render('single-post-screen')
            } else {
                res.render('single-post-screen', {post: doc})
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

router.put('/update/:id', async(req, res) => {
    if (req.user.id === req.params.id) {
        const updatedPost = Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true});
        res.status(200).json(updatedPost)
    } else {
        res.status(500).json("You can only edit posts that you have authored")
    }
})

module.exports = router