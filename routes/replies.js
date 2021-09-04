const express = require('express');
const router = express.Router();
const repliesController = require('../controllers/replies');
const auth = require("../middleware/authentication");


//GET all Replies
router.get('/replies', repliesController.getAllReplies);

router.get('/userReplies', repliesController.userReplies);

router.get('/userReplies/:id', repliesController.userRepliesId);

//POST a new reply
router.post('/replies', auth.checkJwt, repliesController.newReply);

//PUT an existing Reply by reply_id
router.put('/replies/:id', repliesController.updateReply);

//DELETE an existing Reply by reply_id
router.delete('/replies/:id', repliesController.deleteReply);

module.exports = router;
