const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express.Router();
const { authenticateJWT } = require('../../../middlewares/passportErrorJSON');

app.post(
  '/setPassword', 
  authenticateJWT, 
  body('password').not().isEmpty(),
  (req, res) => {
  const errors = validationResult(req);
  if (errors.mapped().password) {
    return res.json({error: "Password is invalid"})
  }
  // confirm that passwords match
  if (req.body.password !== req.body.confirmpassword) {
    return res.json({error: "Passwords don't match"});
  }

  // change password
  req.user.password = req.body.password;
  req.user.save();
  res.json({success: true});
})

module.exports = app;