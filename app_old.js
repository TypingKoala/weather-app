var http = require('http');
var url = require('url');
var axios = require('axios');

// Load environment variables
require('dotenv').config();

const PORT = 3000;

function oldHandle(req, res) {
  res.write("Hello Nafim!\n");
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl.query.zipcode);
  res.write(req.url);
  res.end();
}

function handle(req, res) {
  const zip = url.parse(req.url, true).query.zipcode;
  const queryParams = new URLSearchParams({
    zip,
    appid: process.env.OWM_API_KEY
  });
  axios('https://api.openweathermap.org/data/2.5/weather?' + queryParams)
    .then(response => {
      const conditions = response.data.weather[0].main;
      res.write(`The weather in ${response.data.name} is ${conditions}.`);
    })
    .catch(err => {
      console.log(err);
      res.write('error');
    })
    .then(_ => res.end());
}

http.createServer(handle).listen(PORT);