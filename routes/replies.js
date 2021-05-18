const express = require('express');
const router = express.Router();
const repliesController = require('../controllers/replies');

//GET all Replies
router.get('/replies', repliesController.getAllReplies);
//GET a Reply by reply_id
router.get('/replies/:id', repliesController.getReply)
//GET all replies by user_id
router.get('/replies/:user_id', repliesController.getAllRepliesByUser);
//GET all Replies by post_id and the post it references
router.get('/replies/:post_id', repliesController.getAllRepliesByPost);

//POST a new reply
router.post('/replies', repliesController.newReply);

//PUT an existing Reply by reply_id
router.put('/replies/:id', repliesController.updateReply);

//DELETE an existing Reply by reply_id
router.delete('/replies/:id', repliesController.deleteReply);

module.exports = router;
