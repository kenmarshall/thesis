console.log(Date());

var express = require('express');
var bodyParser = require('body-parser');
var handler = require('../lib/request-handler.js');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/status', (req, res) => {
  handler.getStatus(req.body, (err, status) => {
    if (err) {
      res.status(404).send();
    } else {
      res.status(201).send(status);
    }
  });
});

app.post('/signup', (req, res) => {
  handler.signup(req.body, (err, user) => {
    if (err) {
      console.error(err);
      res.status(400).send();
    } else {
      res.status(200).send(user);
    }
  });
});

app.post('/login', (req, res) => {
  handler.login(req.body, (err, user) => {
    if (err) {
      console.error(err);
      res.status(400).send();
    } else {
      res.status(200).send(user);
    }
  });
});

app.post('/logout', (req, res) => {
  handler.logout(req.body, (err, status) => {
    if (err) {
      console.error(err);
      res.status(400).send();
    } else {
      res.status(200).send();
    }
  });
});

// app.put('/users/:username', (req, res) => {
//   handler.update(req.body, (err, user) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send();
//     } else {
//       res.status(201).send(user);
//     }
//   });
// });

module.exports = app;