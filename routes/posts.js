const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

// GET all Posts
router.get('/posts', postsController.getAllPosts);
// GET all posts by Category
router.get('/posts/:category', postsController.getAllPostsByCategory);
// GET all posts by Instrument
router.get('/posts/:instrument', postsController.getAllPostsByInstrument);
// GET all posts by Genre
router.get('/posts/:genre', postsController.getAllPostsByGenre);

// POST a new Post
router.post('/posts', postsController.newPost)

// UPDATE an existing Post by post_id
router.put('/posts/:id', postsController.updatePost)

// DELETE and existing Post by post_id
router.delete('/posts/:id', postsController.deletePost)

module.exports = router;