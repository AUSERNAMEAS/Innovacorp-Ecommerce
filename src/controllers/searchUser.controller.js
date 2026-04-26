const searchRequest = require('../models/searchUser.model');
const bcrypt = require('bcrypt'); // importing bcrypt to hash passwords
const {saveUserSessionFunction} = require('../utils/functions/userSessionFunctions');
// we import the util to save the user session

async function searchUser(req, res)
{
    // u always have to use res.json to send json responses it could be loading forever if u dont
    try
    {
        //we fetch the email and password from the request body
        const { loginEmail, loginPassword } = req.body;
        const fetch = await searchRequest.searchUserByEmail(loginEmail);
        // u have to access the first element of the array to get the user data
        const user = fetch[0];
        console.log('Fetched user:', user);

        // if the fetch soesnt return any user we send a response saying the user doesnt exist
        if (!fetch.length) 
        {
            return res.json({ success: false, message: "Usuario no existe" });
        }
        const passwordCompared = await bcrypt.compare(loginPassword,user.contrasenia_hash);
        // we check if the user is an Admin or a regular user and we redirect them to the corresponding page
        if (passwordCompared && user.rol === 'cliente')
        {
            // now we save the user session
            saveUserSessionFunction(req, loginEmail);
            res.redirect('/html/FakeShop.html');
        }
        else if (passwordCompared && user.rol === 'Administrador')
        {
            saveUserSessionFunction(req, loginEmail);
            res.redirect('/html/adminPanel.html');
        }/*
        else
        {
            res.json({ success: false, message: "Contraseña incorrecta" });
        }*/
    }

    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { searchUser };   