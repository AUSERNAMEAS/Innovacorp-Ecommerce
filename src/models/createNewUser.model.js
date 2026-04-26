const { poolPromise } = require('../config/db');

async function createNewUser(name, passwordHash, email, phone, google_id, foto_perfil) {
    const pool = await poolPromise;

    await pool.request()
    .input('nombre', name)
    .input('correo', email)
    .input('contrasenia_hash', passwordHash)
    .input('telefono', phone)
    .input('google_id', google_id)
    .input('foto_perfil', foto_perfil)
    .query(

    "INSERT INTO cliente (nombre, correo, contrasenia_hash, telefono, google_id, foto_perfil) VALUES (@nombre, @correo, @contrasenia_hash, @telefono, @google_id, @foto_perfil)")
}

module.exports = {
    createNewUser
}