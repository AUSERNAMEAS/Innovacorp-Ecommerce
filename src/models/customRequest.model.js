const { poolPromise } = require('../config/db');
// we import the database connection pool to use it in our queries
async function createRequest(tipo_producto, instrucciones, imagen_nombre,imagen_base,id_cliente) {
  const pool = await poolPromise;
// this is the sintaxis to make a query using mssql with input parameters
  await pool.request()
    .input('tipo_producto', tipo_producto)
    .input('instrucciones', instrucciones)
    .input('imagen_nombre', imagen_nombre)
    .input('json_disenio', imagen_base)
    .input('id_cliente', id_cliente)
    
    //.input('imagen_nombre', imagen_nombre)
    .query(`
      INSERT INTO solicitud_personalizacion 
      (tipo_producto, instrucciones, imagen_nombre, json_disenio, estado, fecha_solicitud,id_cliente)
      VALUES (@tipo_producto, @instrucciones, @imagen_nombre, @json_disenio, 'Pendiente', GETDATE(), @id_cliente)
    `);
}

async function getImageCustomRequest(id_solicitud) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_solicitud', id_solicitud)
    .query(`
      SELECT json_disenio,instrucciones,tipo_producto,fecha_solicitud FROM solicitud_personalizacion WHERE id_solicitud = @id_solicitud
    `);
  return result.recordset[0];
}

module.exports = {
  createRequest,
  getImageCustomRequest
};
