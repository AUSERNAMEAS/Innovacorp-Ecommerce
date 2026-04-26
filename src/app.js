require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session'); //importing express-session to simulate user sessions
const passport = require('passport'); //importing passport for authentication
require('./config/passport'); //importing passport configuration


app.use(express.json()); // this uses middleware to parse JSON bodies

// Configuring express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretoo',// secret key for signing the session ID cookie,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//initializing passport and telling express to use it for session handling
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public')); //this serves static files from the public directory
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies


module.exports = app;