const express = require('express');
const app = express.Router();

const passport = require('passport');

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.'
}));

app.get('/user', (req, res) => {
  if (req.user) return res.send(req.user.email);
  res.send("Not logged in");
});

module.exports = app;