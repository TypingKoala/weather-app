const express = require('express');
const app = express.Router();

const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser');

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

// implement JWT authentication
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.audience = process.env.JWT_AUD;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
  User.findOne({
    email: jwt_payload.sub
  }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

app.use(passport.initialize());

app.use('/api', require('./api'));
// app.use(require('./login'));
// app.use(require('./register'));
// app.use(require('./reset'));

module.exports = app;