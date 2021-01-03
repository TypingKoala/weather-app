const express = require('express');
const app = express.Router();
const axios = require('axios');

app.get('/weather', (req, res, next) => {
  const zip = req.query.zipcode;
  // check for valid zip before sending request
  if (zip.length !== 5) return res.status(400).json({"error": "Invalid ZIP Code"});

  const queryParams = new URLSearchParams({
    zip,
    appid: process.env.OWM_API_KEY
  });
  axios('https://api.openweathermap.org/data/2.5/weather?' + queryParams)
    .then(response => {
      return res.json({
        conditions: response.data.weather[0].main,
        city: response.data.name,
        temperature: Math.round((response.data.main.temp - 273.15) * 9/5 + 32),
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        windDegree: response.data.wind.deg,
        imgURL: `//openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
      });
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(400).json({error: "Invalid ZIP Code"})
        } else {
          return res.status(500).json({error: "Internal Server Error"})
        }
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message)
      }
    });
})

module.exports = app;