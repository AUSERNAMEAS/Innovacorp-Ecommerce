const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {fillDashboard, addNewProductController,updateStock,acceptCustomOrder,updateOrderStatusController,deleteOrderController,deleteCustomRequestController,updateProduct,deleteProduct,reactivateProduct,getfilteredOrdersController,loadPage} = require('../controllers/adminPanel.controller');
const { verifyAdminFunction,verifySessionFunction} = require('../utils/functions/userSessionFunctions');

router.get('/view', verifySessionFunction,verifyAdminFunction,loadPage);
router.get('/', verifySessionFunction,verifyAdminFunction,fillDashboard);
//upload.single("imagen") is used to handle the file upload for the product image
router.post('/add-product', verifySessionFunction,verifyAdminFunction,upload.single("imagen"),addNewProductController);
router.put('/update-stock', verifySessionFunction,verifyAdminFunction, updateStock);
router.put('/accept-custom-order/:id_request', verifySessionFunction,verifyAdminFunction,acceptCustomOrder);
router.put('/update-order-status', verifySessionFunction,verifyAdminFunction,updateOrderStatusController);
router.delete('/delete-order/:id', verifySessionFunction,verifyAdminFunction, deleteOrderController);
router.delete('/delete-custom-request/:id', verifySessionFunction,verifyAdminFunction, deleteCustomRequestController);
router.put('/update-product/:id', verifySessionFunction,verifyAdminFunction, updateProduct);
router.put('/delete-product/:id', verifySessionFunction,verifyAdminFunction, deleteProduct);
router.put('/reactivate-product/:id', verifySessionFunction,verifyAdminFunction, reactivateProduct); 
router.get('/filteredOrders/:email', verifySessionFunction,verifyAdminFunction, getfilteredOrdersController);
module.exports = router;
