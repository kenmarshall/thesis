console.log(Date());

var express = require('express');
var handler = require('../lib/request-handler.js');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello!');
})

app.get('/status', (req, res) => {
  handler.getStatus(req.body, (err, status) => {
    if (err) {
      res.status(404).send();
    } else {
      res.status(201).send(status);
    }
  });
});

app.get('/signup', (req, res) => {
  handler.signup
})

module.exports = app;