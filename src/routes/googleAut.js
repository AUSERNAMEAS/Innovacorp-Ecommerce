const express = require('express');
const router = express.Router();
const passport = require('passport');
const createNewUserController = require('../controllers/createNewUser.controller');
const {saveUserSessionFunction}= require('../utils/functions/userSessionFunctions');


// 1. Route to start Google Login
router.get('/',
    //the scope means that the client accepts to share the profile and email with our app
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. The Callback route (where Google sends the user back)
router.get('/callback', 
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  async (req, res) => {
    //console.log("LO QUE GOOGLE ME MANDÓ:", req.user);
    const emailSession = req.user.emails?.[0]?.value || req.user.email || req.user.correo || "";

    // If user is new OR we don't have their phone number
    if (req.user.isNew) {
        // Send them to the "Finish Registration" page
            const nombre = encodeURIComponent(req.user.displayName || "Usuario");
            const id = encodeURIComponent(req.user.id || "");
            const correo = encodeURIComponent(req.user.emails?.[0]?.value || "");


            // Ponemos un RETURN para que la función se detenga aquí
            return res.redirect(`/html/CompleteRegister.html?nombre=${nombre}&correo=${correo}&id=${id}`);
    }

     await saveUserSessionFunction(req, emailSession);

    

    
    // If they are alr a customer, send them to the homepage
    res.redirect('/html/FakeShop.html');
  });

router.post('/complete-registration', createNewUserController.createUserGoogle);

module.exports = router;