const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/searchUser.model'); // my user model


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL: "/auth/google/callback"
  },
  // This function is called after Google has authenticated the user
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        // we search if the user alr exists
        let userResult = await userModel.searchUserByEmail(email);

        if (userResult && userResult.length > 0) {
            // if it exists, we return the user
            let user = userResult[0];
            return done(null, user);
        } else {
            // else we return the google profile as a new user
            // we create a new property to know that the profile is new
            //this get us to the callback endpoint
            profile.isNew = true; 
            return done(null, profile);
        }
    } catch (err) {
        return done(err, null);
    }
  }
));

// Estas funciones sirven para que Passport guarde al usuario en la sesión
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));