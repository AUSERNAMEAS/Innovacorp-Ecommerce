const express = require('express');
const router = express.Router();
const createNewUserController = require('../controllers/createNewUser.controller');


router.post('/', createNewUserController.createUser);

module.exports = router;