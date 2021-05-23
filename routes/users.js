const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const midWare = require('../middleware/authentication')

//returns all users and all columns
router.get('/users', usersController.getUsers);

//returns all the users info inculding their genre and instrument
router.get('/user/:user_id', usersController.getUserById);

router.post('/createUser', usersController.createUser)



module.exports = router;