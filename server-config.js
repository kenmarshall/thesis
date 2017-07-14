console.log(Date());

var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.send('Hello!');
})

// app.post('/', function(req, res) {
//   res.send('Hello!');
// })


module.exports = app;