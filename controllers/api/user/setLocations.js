const express = require('express');
const app = express.Router();
const { authenticateJWT } = require('../../../middlewares/passportErrorJSON');

app.post('/setLocations', authenticateJWT, (req, res) => {
  req.user.locations = req.body.locations;
  req.user.save();
  res.json({success: true});
})

module.exports = app;