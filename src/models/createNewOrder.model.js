const {poolPromise} = require('../config/db');
// i forgot ts bruh
const sql = require('mssql');

async function getUserByEmail(email)
{
    try
    {
    const pool = await poolPromise;
    const result = await pool.request().
        input('email', email).
        query(`
            SELECT 
                id_cliente
            FROM cliente
            WHERE correo = @email
        `);
        // the result should have one record with the user data
    return result.recordset[0];
    }
    catch(error)
    {
        throw error;
    }
}
    

async function insertOrder(transaction,idUser, paymentMethod,total,description) 
{
    try
    {
        const request = new sql.Request(transaction);
        const result = await request.
        input('id_cliente', idUser).
        input('metodo_pago', paymentMethod).
        input('total', total).
        input('descripcion', description).
        query(`
            INSERT INTO pedido (id_cliente, fecha_pedido, estado_pedido, metodo_pago, total, detalle_string_pedido)
            OUTPUT INSERTED.id_pedido
            VALUES (@id_cliente, GETDATE(), 'Pendiente', @metodo_pago, @total, @descripcion)
            `);
        //if the insert didnt return anything, throw an error
        if (!result.recordset.length) 
        {
        throw new Error("Error al insertar el pedido");
        }
        // here we get the id of the inserted order
        const id_pedido = result.recordset[0].id_pedido;
        return id_pedido;
    }
    catch(error)
    {
        throw error;
    }
    
}

async function insertOrderDetails(transaction, idOrder, idUser, data)
{
    try
    {
        for(const item of data)
        {
            //here we go through each item and insert it
            const request = new sql.Request(transaction);
            const result = await request.
            input('id_pedido', idOrder).
            input('id_cliente', idUser).
            input('id_producto', item.id_producto).
            input('cantidad', item.quantity).
            input('precio_unitario', item.precio_unitario).
            query(`
                INSERT INTO detalle_pedido (id_pedido, id_producto, id_cliente, cantidad, precio_unitario, subtotal)
                VALUES (@id_pedido, @id_producto, @id_cliente, @cantidad, @precio_unitario, @cantidad * @precio_unitario)
        `);
            //after inserting the item, we need to update the stock
            await updateStock(transaction, item.id_producto, item.quantity);
        }
        console.log("All items inserted successfully");
    }
    catch(error)
    {
        throw error;
    }
}

async function updateStock(transaction, idProduct, quantity)
{
    try
    {
        if(!idProduct || !quantity)
        {
            throw new Error("Product ID or quantity missing for stock update");
        }
         const request = new sql.Request(transaction);
        // we get the data from parameters and update the stock
        await request
        .input('id_producto', idProduct)
        .input('cantidad', quantity)
        .query(`
            UPDATE producto 
            SET stock = stock - @cantidad 
            WHERE id_producto = @id_producto
        `);
        console.log(`Stock updated for product ID: ${idProduct}`);

    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
   

}

async function insertShippingDetails(transaction, idOrder, data)
{
    try
    {
        if(!data || !idOrder)
        {
            throw new Error("Id or data missing for shipping details");
        }

        const request = new sql.Request(transaction);
        const shipppingAddress = `${data.datos_envio.direccion}, ${data.datos_envio.ciudad}`;
        const pool = await poolPromise;
        const result = await request.
        input('id_pedido', idOrder).
        input('direccion_envio', shipppingAddress).
        input('costo_envio', data.costo_envio).
        query(`
            INSERT INTO envio (id_pedido, direccion_envio, empresa_envio, costo_envio,numero_guia, estado_envio, fecha_envio,fecha_entrega) 
            VALUES (@id_pedido, @direccion_envio, 'pendiente', @costo_envio,'pendiente' ,'Pendiente de empaque', GETDATE(), NULL)
        `);
        console.log("Shipping details inserted successfully");
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }

}
   
module.exports = { getUserByEmail, insertOrder, insertOrderDetails, updateStock , insertShippingDetails};