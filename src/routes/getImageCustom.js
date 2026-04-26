const express = require('express');
const router = express.Router();
const {showImageCustom}= require('../controllers/customRequest.controller');

router.get('/get-image/:id_solicitud',showImageCustom);

module.exports = router;