const express = require('express');
const axios = require("axios");
var cookieParser = require('cookie-parser')

// Load environment variables
require('dotenv').config();

const app = express();
const port = 3000;

// set rendering engine
app.set('view engine', 'pug');

// add cookie parser
app.use(cookieParser());

app.get('/', (req, res) => {
  const zip = req.query.zipcode || req.cookies.zipcode || "02139";
  const queryParams = new URLSearchParams({
    zip,
    appid: process.env.OWM_API_KEY
  });
  axios('https://api.openweathermap.org/data/2.5/weather?' + queryParams)
    .then(response => {
      const city = response.data.name;
      const conditions = response.data.weather[0].main;
      const icon_url = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`;
      res.cookie("zipcode", zip); // set zipcode cookie for next load
      res.render('weather', { city, conditions, icon_url });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});