//this file is used to get all products from the database
const {poolPromise} = require('../config/db');
// we import the database connection pool to use it in our queries
async function getAllProducts() 
{
    const pool = await poolPromise;
    //the basic sintax to make a query using mssql
    const result = await pool.request().query(`
        SELECT 
            id_producto,
            nombre,
            precio_unitario,
            imagen,
            categoria,
            stock,
            estado_producto
        FROM producto
    `);
        //we use recordser to get the array of results
    return result.recordset;
}

async function getProductById(id) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('id', id)
        .query(`
            SELECT 
                id_producto,
                nombre,
                precio_unitario,
                imagen,
                categoria,
                descripcion
            FROM producto
            WHERE id_producto = @id
        `);

    return result.recordset[0];
}
module.exports = {
    getAllProducts,
    getProductById
};