const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

//returns all users and all columns
router.get('/users', usersController.getUsers);

//returns all the users info inculding their genre and instrument
router.get('/user/:user_id', usersController.getUserById);



module.exports = router;