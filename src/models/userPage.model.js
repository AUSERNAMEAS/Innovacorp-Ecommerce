// models/customRequestModel.js

const { poolPromise } = require('../config/db');

async function getUserCustomRequests(userId) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('userId', userId)
        .query(`
            SELECT 
                id_solicitud,
                CONVERT(VARCHAR(10), fecha_solicitud, 120) AS fecha_solicitud,
                tipo_producto,
                instrucciones,
                estado,
                json_disenio
            FROM solicitud_personalizacion
            WHERE id_cliente = @userId
            ORDER BY fecha_solicitud DESC
        `);

    return result.recordset;
}

async function getBasicInfoUser(email) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('email', email)
        .query(`
            SELECT 
                correo,
                telefono
            FROM cliente
            WHERE correo = @email
        `);

    return result.recordset[0];
}

async function updatePhoneNumber(email, newPhone) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('email', email)
        .input('newPhone', newPhone)
        .query(`
            UPDATE cliente
            SET telefono = @newPhone
            WHERE correo = @email
        `);

    return result;
}

async function orderInfo(orderID) {
    const pool = await poolPromise;

  
    try{
          const result = await pool.request().input('orderID', orderID)
        .query(`
            select pedido.id_pedido,pedido.id_cliente,fecha_pedido,estado_pedido,total,detalle_string_pedido,detalle_pedido.id_producto,cantidad,imagen,detalle_pedido.precio_unitario,envio.direccion_envio from pedido
            INNER JOIN detalle_pedido ON pedido.id_pedido = detalle_pedido.id_pedido  INNER JOIN producto ON
            detalle_pedido.id_producto = producto.id_producto
            INNER JOIN envio ON envio.id_pedido = pedido.id_pedido

where pedido.id_pedido = @orderID


        `);
          const rows = result.recordset;


    // 1. Validar si el pedido no existe (el array está vacío)
    if (rows.length === 0) {
        return null; 
    }

    // 2. Estructurar el objeto principal usando la primera fila (índice 0)
    // Estos datos son iguales en todas las filas, así que los tomamos una vez.
    const structureOrder = {
        id_pedido: rows[0].id_pedido,
        id_cliente: rows[0].id_cliente,
        fecha_pedido: rows[0].fecha_pedido,
        estado_pedido: rows[0].estado_pedido,
        total: rows[0].total,
        detalle_string_pedido: rows[0].detalle_string_pedido,
        direccion_envio: rows[0].direccion_envio,
        productos: [] // Array vacío que llenaremos a continuación
    };

    // 3. Iterar sobre TODAS las filas para extraer los productos y empujarlos al array
    rows.forEach(row => {
        structureOrder.productos.push({
            id_producto: row.id_producto,
            cantidad: row.cantidad,
            precio_unitario: row.precio_unitario,
            imagen: '../' + row.imagen 
        });
    });

    // 4. Retornar el objeto perfectamente anidado
    return structureOrder;
        }catch(error)
        {
            console.error("Error fetching order info:", error);
            throw error;
        }

  

}

module.exports = {
    getUserCustomRequests,
    getBasicInfoUser,
    updatePhoneNumber,
    orderInfo
};