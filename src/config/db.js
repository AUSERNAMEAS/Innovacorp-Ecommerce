const sql = require('mssql');

const config = {
  user: "sa",
  password: "SaPrueba2026$",
  server: "MashaKujou",
  database: "Ventas",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
//set this pool to be used throughout the app


const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => 
  {
    console.log(' Conectado a SQL Server');
    return pool;
  })
  .catch(err => 
  {
    console.error(' Error de conexión DB:', err);
    throw err; 
  });


  module.exports = {poolPromise};