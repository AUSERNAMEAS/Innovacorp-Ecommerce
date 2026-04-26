const express = require('express');
const router = express.Router();
const searchUserController = require('../controllers/searchUser.controller');
//the router to get all products,in server .js we use this router
//now we using controller to do the lofic part there and here just call the controller function

router.post('/', searchUserController.searchUser);
module.exports = router;