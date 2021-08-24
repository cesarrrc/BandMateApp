const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');


router.post('/login', usersController.loginUser);

//returns all users and all columns
router.get('/users', usersController.getUsers);

//returns all the users info inculding their genre and instrument
router.get('/user/:user_id', usersController.getUserById);

router.post('/createUser', usersController.createUser)



module.exports = router;