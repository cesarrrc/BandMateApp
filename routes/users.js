const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

//returns all users and all columns
router.get('/users', usersController.getUsers);

//returning all the users info inculding their genre
router.get('/user/:user_id', usersController.getUserById2);
//return all user info not including genre or instrument

//returns the instrument
router.get('/user/:user_id/instruments', usersController.getUserById2);

router.get('/users/instruments', usersController.getAllUsersByInstrument);


module.exports = router;