const express = require('express');
const app = express.Router();

const { validateRecaptcha } = require('../middlewares/recaptcha');

const {
  body,
  validationResult
} = require('express-validator');

// import user model
const User = require('../models/user');

app.get('/register', (req, res) => {
  res.render('register', { sitekey: process.env.RECAPTCHA_SITE_KEY });
});

// Validate email is unique
function validateEmailIsUnique(req, res, next) {
  User.exists({ email: req.body.email }, (err, exists) => {
    if (err) return next(err);
    req.emailInUse = exists;
    return next();
  });
}

app.post(
  '/register',
  body('email').isEmail(),
  validateEmailIsUnique,
  body('password').not().isEmpty(),
  validateRecaptcha,
  (req, res) => {
    // recaptcha check
    if (!req.recaptchaVerified) {
      req.flash('error', 'Not a human :(');
      return res.redirect('/register');
    }
    // validate inputs
    const errors = validationResult(req);
    if (errors.mapped().email) {
      req.flash('error', 'Email is invalid');
      return res.redirect('/register');
    } else if (errors.mapped().password) {
      req.flash('error', 'Password is invalid');
      return res.redirect('/register');
    }
    if (req.body.password !== req.body.confirmpassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }
    // check if email is unique
    if (req.emailInUse) {
      req.flash('error', 'Email is already registered');
      return res.redirect('/register');
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    newUser.save((err, user) => {
      if (err) console.error(err);
    });

    res.redirect('/');
  });

module.exports = app;