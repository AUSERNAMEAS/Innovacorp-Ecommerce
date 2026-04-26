const {searchOrdersByUserId} = require('../models/searchUser.model');
const {getUserByEmail} = require('../models/createNewOrder.model');
const { getUserCustomRequests,getBasicInfoUser,updatePhoneNumber,orderInfo} = require('../models/userPage.model');



async function loadOrdersUser(req,res)
{
    //verify if the user session exists
    const userRaw= await getUserByEmail(req.session.user.email);
    const userID = userRaw.id_cliente;
    const result =await searchOrdersByUserId(userID);
    res.json(result);
}

async function loadCustomRequestsUser(req, res) {
    try {
        // 1. verify session
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 2. get user data from DB
        const userRaw = await getUserByEmail(req.session.user.email);

        if (!userRaw) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userID = userRaw.id_cliente;

        // 3. get custom requests
        const result = await getUserCustomRequests(userID);

        res.json(result);

    } catch (error) {
        console.error('Error loading custom requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function getBasicInfoUserController(req, res) {
    try {
        // 1. verify session
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 2. get basic info
        const basicInfo = await getBasicInfoUser(req.session.user.email);

        res.json(basicInfo);

    } catch (error) {
        console.error('Error loading basic info:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function updatePhoneNumberController(req, res) {
    try {
        // 1. verify session
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 2. get the new phone number from the request body
        const { telefono } = req.body;
        const stringPhone = telefono.toString(); 

        // 3. update the phone number
        await updatePhoneNumber(req.session.user.email, stringPhone);

        res.json({ success: true, message: 'Phone number updated successfully' });

    } catch (error) {
        console.error('Error updating phone number:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function orderInfoController(req, res) {
    try {
        const { orderId } = req.params;
        const result = await orderInfo(orderId);
        // Si result es null (la BD no regresó nada)
        if (!result) {
            return res.status(404).json({ error: 'El pedido no existe o le faltan datos' });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error loading order info:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { loadOrdersUser , loadCustomRequestsUser, getBasicInfoUserController, updatePhoneNumberController, orderInfoController};