const express = require('express');
const app = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../../../models/user');
const pug = require('pug');
const jwt = require('jsonwebtoken');

// configure nodemailer
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'mg.jbui.me'
  }
};
const nodemailerMailgun = nodemailer.createTransport(mg(auth));

// Password reset function
// cb(err) will be called with True if error occurs
function attemptPasswordReset(email, cb) {
  User.findOne({ email }, (err, user) => {
    if (err) return;
    if (!user) return;

    // create jwt for sign-in
    const token = jwt.sign({
      sub: user.email,
      aud: process.env.JWT_AUD 
    }, process.env.JWT_SECRET)

    // generate email
    const passwordResetLink = `http://localhost:3000/changePassword/${token}`;
    const html = pug.renderFile('views/emailtemplate.pug', {
      passwordResetLink
    });

    // send email
    nodemailerMailgun.sendMail({
      from: 'reset@jbui.me',
      to: email,
      subject: "Your Password Reset Link",
      html
    }, (err, info) => {
      cb(err);
    });
  });
}

app.post(
  '/sendResetEmail', 
  body('email').isEmail().normalizeEmail(),
  (req, res, next) => {
  // check validation
  const errors = validationResult(req);
  if (errors.mapped().email) {
    return res.json({error: "Email is invalid"})
  }

  attemptPasswordReset(req.body.email, (err) => {
    if (err) return next(err);
    return res.json({success: true});
  });
})

module.exports = app;