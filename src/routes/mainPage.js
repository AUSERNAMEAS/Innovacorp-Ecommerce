const express = require('express');
const router = express.Router();
const mainPageController = require('../controllers/mainPage.controller');


router.get('/', mainPageController.verifyUserSession);
module.exports = router;
// this is the main page route
