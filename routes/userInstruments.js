const express = require('express');
const router = express.Router();
const userInstrumentsController = require('../controllers/userInstruments');
const auth = require("../middleware/authentication");

router.post('/addInstrument', userInstrumentsController.addUserInstrument);

module.exports = router;