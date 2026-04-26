const addUser = require('../models/createNewUser.model');
const bcrypt = require('bcrypt'); // importing bcrypt to hash passwords
const {saveUserSessionFunction}= require('../utils/functions/userSessionFunctions');

async function createUser(req, res) 
{
 try
    {
    //first we need to get the data from the request body then hash the password
    const {name, email, password, phone} = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (!name || !email || !password || !phone) 
        {
        return res.status(400).json(
            { success: false, message: 'Faltan datos obligatorios.' });

        }
        // now we can call the model function to create the new user and save the user session
    await addUser.createNewUser(name, passwordHash, email, phone);
    await saveUserSessionFunction(req, email);
    console.log('New user created and session saved:', req.session.user);
    res.redirect('/html/FakeShop.html');
    }
    catch (error)
    {
        res.status(500).json({ success: false, message: error.message });
    }

}

async function createUserGoogle(req, res)
{
    if (!req.user) {
            console.error("DEBUG: req.user es undefined");
            return res.status(401).json({ 
                success: false, 
                message: "Sesión expirada. Por favor, inicia sesión con Google nuevamente." 
            });
        }

    try
    {
        const { telefono, nombre, correo, google_id } = req.body;

        // we create a new user with the google data and the phone number that the user provided
        if (!correo || correo === "") {
            return res.status(400).json({ success: false, message: "Datos de Google incompletos" });
        }

        await addUser.createNewUser(
        nombre,
        null, // no password for google users
        correo,
        telefono,
        google_id,
        null // no profile picture for now, you can modify the model and controller to add this feature if you want
        );

        await saveUserSessionFunction(req, correo);

        res.redirect('/html/FakeShop.html');

    }
    catch (error)
    {
          console.error("🔴 ¡ERROR FATAL ATRAPADO!:", error.message);
        console.error(error.stack); 
    }
}

module.exports = { createUser, createUserGoogle };