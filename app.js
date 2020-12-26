const express = require('express');
var cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

// Connect to database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to database!");
});

const app = express();
const port = 3000;

// set rendering engine
app.set('view engine', 'pug');

// add cookie parser
app.use(cookieParser());

app.use(require('./controllers'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});