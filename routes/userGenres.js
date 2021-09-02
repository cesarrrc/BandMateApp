const express = require('express');
const router = express.Router();
const userGenreContoller = require('../controllers/userGenres');
const auth = require("../middleware/authentication");

router.post('/addGenre', userGenreContoller.addUserGenre);

module.exports = router;