const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequest.controller');
const { verifySessionFunction } = require('../utils/functions/userSessionFunctions');

router.post('/', verifySessionFunction, customRequestController.createRequest);

module.exports = router;
