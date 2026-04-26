const {getUserByEmail,insertOrder,insertOrderDetails,insertShippingDetails} = require('../models/createNewOrder.model');
const sql = require('mssql');
const { poolPromise } = require('../config/db');
//we added this to use transactions(ROLLBACKS)


async function createNewOrder(req, res) 
{
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    try
    {
        await transaction.begin(); // we initialize the transaction
        //frist we get the variables from the request body and session
        const datos = req.body;
        const email = req.session.user.email;
        const userRaw= await getUserByEmail(email);
        if (!datos)
        {
            return res.status(400).json(
            { success: false, message: 'Faltan datos del pedido.' });
        }
        if (!email)
        {
            return res.status(400).json(
            { success: false, message: 'error al obtener usuario ' });
        }
        const userID = userRaw.id_cliente;
        const total = datos.total_final;
        //here we can create the order  
        const orderID = await insertOrder (transaction,userID, datos.metodo_pago,total,datos.descripcion);
        // then we update and insert the order details
        await insertOrderDetails(transaction, orderID, userID, datos.carrito);

        //throw new Error("TEST ROLLBACK");
        //js TEST TEST E¿TEST


        // almost done, now we insert into shipping details
        await insertShippingDetails(transaction, orderID, datos);
        //finally we send a success response

        await transaction.commit(); // if everything is ok, we commit the transaction




        res.json({ message: `Creating order for user:${userID } and ${email} 
            datos { ${JSON.stringify(datos)} }`,
                    success: true,
                    user: userID
        });
    }
    catch (error)
    {
        transaction.rollback(); // if there is any error, we rollback the transaction
        res.status(500).json({ success: false, message: error.message });
    }
   
}




module.exports = { createNewOrder };