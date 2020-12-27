const express = require('express');
const app = express.Router();

const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser');

const flash = require('express-flash');
var cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Passport configuration
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);

      // check for valid password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err || !isMatch) return done(null, false);
        done(null, user);
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(require('./home'));
app.use(require('./login'));
app.use(require('./register'));

module.exports = app;