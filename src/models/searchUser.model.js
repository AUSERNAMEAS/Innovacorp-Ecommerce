const {poolPromise} = require('../config/db');

async function searchUserByEmail(email) 
{
    const pool = await poolPromise;
    const result = await pool.request().
    input('email', email).query(`
        select 
        correo,contrasenia_hash,rol
        from cliente 
        where correo=@email`);
    return result.recordset;
}

async function searchOrdersByUserId(idUser)
{
    const pool = await poolPromise;
    const result = await pool.request().
    input('id_cliente', idUser).query(`
    select envio.id_pedido,fecha_envio,SUM(subtotal) as suma_total,estado_pedido
    from envio INNER JOIN detalle_pedido ON
    detalle_pedido.id_pedido = envio.id_pedido
    INNER JOIN pedido ON pedido.id_pedido = envio.id_pedido
    where pedido.id_cliente = @id_cliente
    group by envio.id_pedido, envio.fecha_envio,
    pedido.estado_pedido;`);
    return result.recordset;
}
module.exports = {
    searchUserByEmail,
    searchOrdersByUserId
};