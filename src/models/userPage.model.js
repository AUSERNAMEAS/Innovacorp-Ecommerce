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

module.exports = {
    getUserCustomRequests,
    getBasicInfoUser,
    updatePhoneNumber
};