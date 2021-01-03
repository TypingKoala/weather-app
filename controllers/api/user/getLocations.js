const express = require('express');
const app = express.Router();
const { authenticateJWT } = require('../../../middlewares/passportErrorJSON');

app.get('/getLocations', authenticateJWT, (req, res) => {
  return res.json({ locations: req.user.locations });
})

module.exports = app;