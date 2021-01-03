const express = require('express');
const app = express.Router();

const jwt = require('jsonwebtoken');
const { authenticateLocal } = require('../../../middlewares/passportErrorJSON');

app.post('/getToken', authenticateLocal, (req, res) => {
  const token = jwt.sign({
    sub: req.user.email,
    aud: process.env.JWT_AUD 
  }, process.env.JWT_SECRET)
  return res.json({ token })
})

module.exports = app;