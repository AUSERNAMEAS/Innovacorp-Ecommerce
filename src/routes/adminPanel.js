const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {fillDashboard, addNewProductController,updateStock,acceptCustomOrder,updateOrderStatusController,deleteOrderController,deleteCustomRequestController,updateProduct,deleteProduct,reactivateProduct,getfilteredOrdersController} = require('../controllers/adminPanel.controller');


router.get('/', fillDashboard);
//upload.single("imagen") is used to handle the file upload for the product image
router.post('/add-product',upload.single("imagen"),addNewProductController);
router.put('/update-stock', updateStock);
router.put('/accept-custom-order/:id_request', acceptCustomOrder);
router.put('/update-order-status', updateOrderStatusController);
router.delete('/delete-order/:id', deleteOrderController);
router.delete('/delete-custom-request/:id', deleteCustomRequestController);
router.put('/update-product/:id',  updateProduct);
router.put('/delete-product/:id', deleteProduct);
router.put('/reactivate-product/:id', reactivateProduct); 
router.get('/filteredOrders/:email', getfilteredOrdersController);
module.exports = router;
