const express = require('express');
const app = express.Router();
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

// Validate email is unique
function validateEmailIsUnique(req, res, next) {
  User.exists({ email: req.body.email }, (err, exists) => {
    if (err) return next(err);
    req.emailInUse = exists;
    return next();
  });
}

app.post(
  '/signup', 
  body('email').isEmail().normalizeEmail(),
  validateEmailIsUnique,
  body('password').not().isEmpty(),
  (req, res, next) => {
  // check validation
  const errors = validationResult(req);
  if (errors.mapped().email) {
    return res.json({error: "Email is invalid"})
  } else if (errors.mapped().password) {
    return res.json({error: "Password is invalid"})
  }
  if (req.body.password !== req.body.confirmpassword) {
    return res.json({error: "Passwords don't match"})
  }
  // check if email is unique
  if (req.emailInUse) {
    return res.json({error: "Email already in use"})
  }

  // create new user
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    locations: []
  });
  newUser.save((err, user) => {
    if (err) return next(err);
    // send back token
    const token = jwt.sign({
      sub: req.body.email,
      aud: process.env.JWT_AUD
    }, process.env.JWT_SECRET)
    return res.json({ token })
  });
})

module.exports = app;