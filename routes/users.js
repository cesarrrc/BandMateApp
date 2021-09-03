const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require("../middleware/authentication");

router.post('/login', usersController.loginUser);

router.get('/userInfo', usersController.getUserInfo)

router.get('/userInfo/:id', usersController.getUserInfoById);

router.get('/users', auth.checkJwt, usersController.getUsers);

router.get('/user/:id', usersController.getUserById);

router.post('/createUser', usersController.createUser, usersController.loginUser)

module.exports = router;