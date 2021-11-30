var express = require('express');
const { findById } = require('../models/Post');
var router = express.Router();
const Post = require('../models/Post')

router.post('/create', async (req, res) => {
    const post = new Post({
        author: req.user.id,
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
        Post.find({author: req.user.id}, (error, doc) => {
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
        Post.findById(req.params.id).populate('author').exec().then(doc => {
            res.render('single-post-screen', {post: doc, id: req.params.id, authorID: req.user.id})
        }).catch((err) => {
            res.render('sigle-post-screen')
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// router.put('/update/:id', async(req, res) => {
//     if (req.user.id === req.params.id) {
//         const updatedPost = Post.findByIdAndUpdate(req.params.id, {
//             $set: req.body
//         },{new: true});
//         res.status(200).json(updatedPost)
//     } else {
//         res.status(500).json("You can only edit posts that you have authored")
//     }
// })

router.get('/update/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
        res.render('edit-post', {id: req.user.id, post: post})
    })
})

router.put('/update/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            $set: {"title": req.body.title, "description": req.body.description, "snippet": req.body.snippet}
        }, {new: true}).exec().then(
            res.redirect(`/posts/${req.params.id}`)
        )
    } catch(e) {
        res.status(500).json(e);
    }
})

router.delete('/delete/:id', async (req, res) => {
    Post.findById(req.params.id).exec().then((doc) => {
        if (doc.author == req.user.id) {
                doc.remove()
                req.session.message = {
                    type: 'success',
                    message:'Post deleted successfully!'
                }
                res.redirect('/home-dashboard')
        } else {
            req.session.message = {
                type: 'danger',
                message:'You can only delete your own post'
            }
            res.redirect(`/posts/${req.params.id}`)
        }
    }).catch((error) => res.status(500).json(error))
})

module.exports = router