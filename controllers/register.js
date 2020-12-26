const express = require('express');
const app = express.Router();

const {
  body,
  validationResult
} = require('express-validator');

// import user model
const User = require('../models/user');

app.get('/register', (req, res) => {
  res.render('register');
});

app.post(
  '/register',
  body('email').isEmail(),
  body('password').not().isEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({"errors": errors.array()});
    }
    if (req.body.password !== req.body.confirmpassword) {
      return res.json({
        "error": "passwords don't match"
      });
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