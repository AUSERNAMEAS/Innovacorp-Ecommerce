const {getOrders, getPendingShipments, getMonthlySales,getRecentShipments, getRecentOrders, getPendingCustomRequests, getStockProducts,addNewProduct,updateStockProducts,acceptCustomRequest, updateOrderStatus,deleteOrderById,deleteCustomRequestById,updateProductDetails,deleteProductLogic,reactivateProductLogic,getfilteredOrders} = require ('../models/adminPanel.model')
const path = require('path');
async function fillDashboard(req, res)
{
    
    try
    {
        const orders = await getOrders();
        const pendingShipments = await getPendingShipments();
        const monthlySales = await getMonthlySales();
        const recentShipments = await getRecentShipments();
        const recentOrders = await getRecentOrders();
        const pendingCustomRequests = await getPendingCustomRequests();
        const stockProducts = await getStockProducts();

        res.json({
            success: true,
            data: {
        totalOrders: orders?? 0,
        pendingRequests: pendingShipments?? 0,
        monthlySales: monthlySales ?? 0,
        recentShipments: recentShipments,
        recentOrders: recentOrders,
        pendingCustomRequests: pendingCustomRequests,
        stockProducts: stockProducts
    }
        });
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
    
}

async function loadPage(req, res)
{
    try
    {
        res.sendFile(path.join(__dirname, '../../private/adminPanel.html'));
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function addNewProductController(req, res) {
    try 
    {
        if (!req.file) {
        return res.status(400).json({
            success:false,
            message:"No se subió ninguna imagen"
        });
}

        const { nombre, descripcion, stock, categoria, peso_kg, precio } = req.body;
        const imagePath = "img/products/" + req.file.filename;
        const result = await addNewProduct(nombre, descripcion, stock, categoria, peso_kg, precio, imagePath);
        res.json({ success: true, message: "Producto agregado exitosamente", affectedRows: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateStock(req, res){

    try {

        const products = req.body;

        if(!Array.isArray(products)){
            return res.status(400).json({
                success:false,
                message:"Datos inválidos"
            });
        }

        const result = await updateStockProducts(products);

        res.json(result);

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

async function acceptCustomOrder(req, res) 
{

    try 
    {
        const { id_request } = req.params;
        const result = await acceptCustomRequest(id_request);
        res.json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateOrderStatusController(req, res) 
{
    try
    {
   const updates = req.body; // an array of { id_pedido, estado_pedido }

    for (const update of updates) {
        const { id_pedido, nuevo_estado} = update;

        console.log("ID Pedido:", id_pedido, "Nuevo Estado:", nuevo_estado);

        await updateOrderStatus(id_pedido, nuevo_estado);
    }
    res.json({ success: true, message: "Pedidos actualizados correctamente" });

    }


    catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteOrderController(req, res) {
    try {
        const { id } = req.params;
        await deleteOrderById(id);
        res.json({ success: true, message: "Pedido eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteCustomRequestController(req, res) {
    try {
        const { id } = req.params; //
        await deleteCustomRequestById(id); //
        res.json({ success: true, message: "Solicitud rechazada y eliminada correctamente" }); //
    } catch (error) {
        res.status(500).json({ success: false, message: error.message }); //
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, peso, descripcion } = req.body;
        
        await updateProductDetails(id, { 
            nombre, precio, categoria, peso, descripcion 
        });
        
        res.json({ success: true, message: "Producto actualizado" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// src/controllers/adminPanel.controller.js
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await deleteProductLogic(id);
        res.json({ success: true, message: "Producto desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function reactivateProduct(req, res) {
    try {
        const { id } = req.params;
        await reactivateProductLogic(id);
        res.json({ success: true, message: "Producto reactivado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getfilteredOrdersController(req, res) {
    try {
        const { email } = req.params;
        const orders = await getfilteredOrders(email);
        console.log("Orders for email:", email, orders);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    fillDashboard,
    addNewProductController,
    updateStock,
    acceptCustomOrder,
    updateOrderStatusController,
    deleteOrderController,
    deleteCustomRequestController,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    getfilteredOrdersController,
    loadPage
}