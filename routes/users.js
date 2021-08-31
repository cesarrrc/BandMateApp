const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require("../middleware/authentication");

router.post('/login', usersController.loginUser);

//returns all users and all columns
router.get('/users', auth.checkJwt, usersController.getUsers);

//returns all the users info inculding their genre and instrument
router.get('/user/:user_id', usersController.getUserById);

router.post('/createUser', usersController.createUser, usersController.loginUser)



module.exports = router;