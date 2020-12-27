const express = require('express');
const app = express.Router();
const crypto = require('crypto');

const {
  validateRecaptcha
} = require('../middlewares/recaptcha');

const {
  body,
  validationResult
} = require('express-validator');

// import user model
const User = require('../models/user');

// Password reset function
function attemptPasswordReset(email) {
  User.findOne({ email }, (err, user) => {
    if (err) return;
    if (!user) return;

    // create password reset key
    const resetKey = crypto.randomBytes(32).toString('hex');
    user.resetKey = resetKey;
    user.save();
  });
}

// Request password reset
app.get('/reset', (req, res) => {
  res.render('reset', {
    sitekey: process.env.RECAPTCHA_SITE_KEY
  });
});

app.post(
  '/reset',
  body('email').isEmail(),
  validateRecaptcha,
  (req, res) => {
    // recaptcha check
    if (!req.recaptchaVerified) {
      req.flash('error', 'Not a human :(');
      return res.redirect('/reset');
    }

    // validate inputs
    const errors = validationResult(req);
    if (errors.mapped().email) {
      req.flash('error', 'Email is invalid');
      return res.redirect('/reset');
    }

    attemptPasswordReset(req.body.email);

    req.flash('success', 'If the email is associated with an existing account, a password reset link will be sent.');
    res.redirect('/reset');
  });

// Password change
app.get('/passwordchange/:key', (req, res) => {
  const resetKey = req.params.key;
  if (!resetKey) {
    req.flash('error', 'Invalid reset key');
    return res.redirect('/reset');
  }

  User.findOne({ resetKey }, (err, user) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Something broke.');
      return res.redirect('/');
    } else if (!user) {
      req.flash('error', 'Invalid reset key');
      return res.redirect('/reset');
    } else {
      res.render('passwordchange', { resetKey });
    }
  });
});

app.post(
  '/passwordchange',
  body('password').not().isEmpty(),
  (req, res) => {

    // validate inputs
    const errors = validationResult(req);
    if (errors.mapped().password) {
      req.flash('error', 'Password is invalid');
      return res.redirect('back');
    } else if (req.body.password !== req.body.confirmpassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('back');
    }
    
    User.findOne({ resetKey: req.body.resetKey }, (err, user) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Something broke.');
        return res.redirect('/');
      } else if (!user) {
        req.flash('error', 'Invalid reset key');
        return res.redirect('/reset');
      } else {
        user.password = req.body.password;
        user.resetKey = undefined;
        user.save();
        req.flash('success', 'Password successfully reset.');
        res.redirect('/login');
      }
    });
  });

module.exports = app;