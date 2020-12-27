const express = require('express');
const app = express.Router();
const axios = require('axios');
const FormData = require('form-data');

const {
  body,
  validationResult
} = require('express-validator');

// import user model
const User = require('../models/user');

// Set up Recaptcha
var Recaptcha = require('express-recaptcha').RecaptchaV3;
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, {callback:'cb'});

app.get('/register', recaptcha.middleware.render, (req, res) => {
  res.render('register', { sitekey: process.env.RECAPTCHA_SITE_KEY });
});

const validateRecaptcha = (req, res, next) => {
  // check recaptcha
  var bodyFormData = new FormData();
  bodyFormData.append('secret', process.env.RECAPTCHA_SECRET_KEY);
  bodyFormData.append('response', req.body["g-recaptcha-response"]);
  axios.post("https://www.google.com/recaptcha/api/siteverify", bodyFormData, {
    headers: bodyFormData.getHeaders()
  })
    .then(resp => {
      console.log(resp.data.success);
      req.recaptchaVerified = resp.data.success;
      next();
    })
    .catch(err => next(err));
};

app.post(
  '/register',
  body('email').isEmail(),
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