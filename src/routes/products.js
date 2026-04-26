const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
//the router to get all products,in server .js we use this router
//now we using controller to do the lofic part there and here just call the controller function

router.get('/',productController.getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;