const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require("../middleware/authentication");

router.post('/login', usersController.loginUser);

router.get('/userInfo', auth.checkJwt, usersController.getUserInfo)

router.get('/userInfo/:id', auth.checkJwt, usersController.getUserInfoById);

router.get('/users', auth.checkJwt, usersController.getUsers);

router.get('/user/:id', usersController.getUserById);

router.delete('/user/:id', auth.checkJwt, usersController.deleteUser)

router.post('/createUser', usersController.createUser, usersController.loginUser)

module.exports = router;