const express = require('express');
const router = express.Router();
const createNewOrderController = require('../controllers/createNewOrder.controller');
const {verifySessionFunction} = require('../utils/functions/userSessionFunctions');

// get js for testing
router.post('/', verifySessionFunction, createNewOrderController.createNewOrder);

module.exports = router;