const express = require('express');
const app = express.Router();

// enable CORS for API endpoints
const cors = require('cors');
app.use(cors());

app.use(require('./weather'));
app.use('/user', require('./user'))


module.exports = app;