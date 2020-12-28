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

// serve static files
app.use(express.static('public'));

app.use(require('./controllers'));

// 404 Error handler
const notFoundHandler = (req, res, next) => {
  return res.render('error', {errorMessage: "That page was not found."});
};

// General Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.toString());
  return res.render('error', {errorMessage: "An unexpected error occurred."});
};

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});