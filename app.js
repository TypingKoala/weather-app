const express = require('express');

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
const port = 4000;

// set rendering engine
app.set('view engine', 'pug');

// serve static files
app.use(express.static('public'));

app.use(require('./controllers'));

// 404 Error handler
const notFoundHandler = (req, res, next) => {
  return res.status(404).json({error: "Endpoint not found."});
};

// General Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.toString());
  return res.status(500).json({error: "An unexpected error occurred."});
  
};

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});