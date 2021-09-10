const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const auth = require("../middleware/authentication")

// GET all Posts
router.get('/posts', postsController.getAllPosts);

router.get('/posts/:id', postsController.getAllPostsId)

router.get('/post/:id', postsController.getPostId)

// POST a new Post
router.post('/posts', auth.checkJwt, postsController.newPost)

// PUT an existing Post by post_id
router.put('/posts/:id', postsController.updatePost)

// DELETE and existing Post by post_id
router.delete('/posts/:id', auth.checkJwt, postsController.deletePost)

module.exports = router;