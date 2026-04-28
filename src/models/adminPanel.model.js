const {poolPromise} = require('../config/db');
const sql = require('mssql');

async function getOrders()
{

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT COUNT(id_pedido) AS TotalPedidos FROM pedido
    `);
    //console.log('DEBUG - Orders:', result.recordset); // 👈 debug

    return result.recordset[0].TotalPedidos;
}


// 2️⃣ Get total pending shipments
async function getPendingShipments() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT COUNT(id_envio) AS pendingShipments
        FROM envio
        WHERE estado_envio = 'Pendiente de empaque'
    `);

    return result.recordset[0].pendingShipments;
}


// 3️⃣ Get monthly sales
async function getMonthlySales() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT SUM(total) AS monthlySales
        FROM pedido
        WHERE MONTH(fecha_pedido) = MONTH(GETDATE())
        AND YEAR(fecha_pedido) = YEAR(GETDATE())
    `);

    return result.recordset[0].monthlySales || 0;
}

// 5️⃣ Get recent shipments (calendar)
async function getRecentShipments() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT TOP 5
            CONVERT(VARCHAR(10), fecha_envio, 120) AS shipmentDate,
            COUNT(id_envio) AS total
        FROM envio
        WHERE fecha_envio IS NOT NULL
        GROUP BY fecha_envio
        ORDER BY fecha_envio DESC
    `);

    return result.recordset;
}

async function getRecentOrders()
{
    const pool = await poolPromise;

    const result = await pool.request().query(`
                SELECT TOP 10
    p.id_pedido,
    cliente.nombre AS cliente,
    CONVERT(VARCHAR(10), p.fecha_pedido, 120) AS fecha_pedido,
    p.total,
    p.estado_pedido,
    detalle_pedido.cantidad,
    producto.nombre AS nombre_producto

FROM pedido p
INNER JOIN cliente  ON p.id_cliente = cliente.id_cliente
INNER JOIN detalle_pedido  ON detalle_pedido.id_pedido = p.id_pedido
INNER JOIN producto  ON producto.id_producto = detalle_pedido.id_producto

ORDER BY p.fecha_pedido DESC;
    `);

    return result.recordset;

}

async function getPendingCustomRequests() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        
            SELECT 
            id_solicitud,
            CONVERT(VARCHAR(10), fecha_solicitud, 120) AS fecha_solicitud,
            tipo_producto,
            instrucciones,
            solicitud_personalizacion.id_cliente,
            telefono,
            correo,
            estado

        FROM solicitud_personalizacion INNER JOIN cliente ON
        solicitud_personalizacion.id_cliente = cliente.id_cliente
        ORDER BY fecha_solicitud DESC
    `);

    return result.recordset;
}

async function getStockProducts(){
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT id_producto, nombre, precio_unitario, stock,estado_producto
      FROM producto`);
    return result.recordset;
}

async function addNewProduct(nombre, descripcion, stock, categoria, peso_kg, precio, imagenPath) {
    const pool = await poolPromise;
    const result = await pool.request().
    input('nombre', nombre).
    input('descripcion', descripcion).
    input('stock', parseInt(stock)).
    input('categoria', categoria).
    input('peso_kg', parseFloat(peso_kg)).
    input('precio', parseFloat(precio)).
    input('imagen', imagenPath)
    .query(`
      INSERT INTO producto
      (nombre, descripcion, stock, categoria, peso_kg, estado_producto, precio_unitario, imagen)
      VALUES (@nombre, @descripcion, @stock, @categoria, @peso_kg, 'Activo', @precio, @imagen)
    `);

    return result.rowsAffected[0] > 0; // returns true if a row was inserted
}

async function updateStockProducts(productos){

    const pool = await poolPromise;

    for (const item of productos) {

        const id = parseInt(item.id);
        const cantidad = parseInt(item.stock);

        console.log("ID:", id, "Cantidad:", cantidad);

        if (id > 0) {

            await pool.request()
                .input("id", id)
                .input("cantidad", cantidad)
                .query(`
                    UPDATE producto
                    SET stock = @cantidad
                    WHERE id_producto = @id
                `);
        }
    }

    return {
        success: true,
        message: "Stock actualizado correctamente"
    };
}

async function acceptCustomRequest(id_request) {
    const pool = await poolPromise;
    await pool.request()
        .input('id_request', id_request)
        .query(`
            UPDATE solicitud_personalizacion
            SET estado = 'Aceptada'
            WHERE id_solicitud = @id_request
        `);
    
    return {
        success: true,
        message: "Solicitud aceptada correctamente"
    };
}

async function updateOrderStatus(id_order,newStatus)
{
    const pool = await poolPromise;
    await pool.request()
        .input('id_order', id_order)
        .input('newStatus', newStatus)
        .query(`
            UPDATE pedido
            SET estado_pedido = @newStatus
            WHERE id_pedido = @id_order
        `);
    return{
        success: true,
        message: "Estado del pedido actualizado correctamente"
    }
}

// Agrega esta función a src/models/adminPanel.model.js
async function deleteOrderById(id_pedido) {
    const pool = await poolPromise;
    // Iniciamos una transacción para mayor seguridad
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        
        // 1. Eliminar primero los detalles del pedido (Hijos)
        await request
            .input('id', id_pedido)
            .query('DELETE FROM detalle_pedido WHERE id_pedido = @id');
            
        // 2. Eliminar el registro del envío relacionado (Hijo)
        await request
            .query('DELETE FROM envio WHERE id_pedido = @id');

        // 3. Finalmente eliminar el pedido (Padre)
        await request
            .query('DELETE FROM pedido WHERE id_pedido = @id');

        await transaction.commit();
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function deleteCustomRequestById(id) {
    const pool = await poolPromise; //
    await pool.request()
        .input('id', id)
        .query('DELETE FROM solicitud_personalizacion WHERE id_solicitud = @id'); //
}

async function updateProductDetails(id, data) {
    const pool = await poolPromise;
    await pool.request()
        .input('id', id)
        .input('nom', data.nombre)
        .input('pre', data.precio)
        .input('cat', data.categoria)
        .input('pes', data.peso)
        .input('des', data.descripcion)
        .query(`
            UPDATE producto 
            SET nombre = @nom, 
                precio_unitario = @pre, 
                categoria = @cat, 
                peso_kg = @pes, 
                descripcion = @des 
            WHERE id_producto = @id
        `);
}


//update product state to unactive instead of deleting it from the database

async function deleteProductLogic(id) {
    const pool = await poolPromise;
    await pool.request()
        .input('id', id)
        // 
        .query("UPDATE producto SET estado_producto = 'inactivo' WHERE id_producto = @id"   );
}

async function reactivateProductLogic(id) {
    const pool = await poolPromise;
    await pool.request()
        .input('id', id)
        .query("UPDATE producto SET estado_producto = 'Activo' WHERE id_producto = @id");

}

async function getfilteredOrders(email){
    try {
    const pool = await poolPromise;
    const result = await pool.request()
    .input('email', email)
    .query(`
        select id_pedido,pedido.id_cliente,FORMAT(fecha_pedido, 'yyyy-MM-dd') AS fecha_pedido, total, estado_pedido,detalle_string_pedido,correo from pedido
INNER JOIN cliente ON pedido.id_cliente = cliente.id_cliente where correo = @email
`

) 
return result.recordset;
} catch (error) {
    console.error("Error fetching filtered orders:", error);
    throw error;
}
}
module.exports = {
    getOrders,
    getPendingShipments,
    getMonthlySales,
    getRecentShipments,
    getRecentOrders,
    getPendingCustomRequests,
    getStockProducts,
    addNewProduct,
    updateStockProducts,
    acceptCustomRequest,
    updateOrderStatus,
    deleteOrderById,
    deleteCustomRequestById,
    updateProductDetails,
    deleteProductLogic,
    reactivateProductLogic,
    getfilteredOrders
    
};