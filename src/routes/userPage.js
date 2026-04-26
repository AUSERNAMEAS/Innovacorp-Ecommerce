
const express = require('express');
const router = express.Router();
const {loadOrdersUser,loadCustomRequestsUser,getBasicInfoUserController,updatePhoneNumberController,orderInfoController}= require('../controllers/userPage.controller');
const {verifySessionFunction} = require('../utils/functions/userSessionFunctions');

// we use a middleware to verify the session before loading orders
router.get('/', verifySessionFunction, loadOrdersUser);
router.get('/custom-requests', verifySessionFunction, loadCustomRequestsUser);
router.get('/basic-info', verifySessionFunction, getBasicInfoUserController);
router.put('/update-phone', updatePhoneNumberController);
router.get('/order-info/:orderId', orderInfoController);
module.exports = router;