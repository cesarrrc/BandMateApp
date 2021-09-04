const express = require('express');
const router = express.Router();
const userGenreContoller = require('../controllers/userGenres');
const auth = require("../middleware/authentication");

router.get('/userGenres', userGenreContoller.userGenres);

router.get('/userGenre/:id', userGenreContoller.userGenreId);

router.post('/addGenre', auth.checkJwt, userGenreContoller.addUserGenre);

module.exports = router;