const express = require('express');
const router = express.Router();
const {deleteUserSessionFunction}= require('../utils/functions/userSessionFunctions');

router.get('/',deleteUserSessionFunction);

module.exports = router;