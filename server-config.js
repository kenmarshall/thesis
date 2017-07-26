console.log(Date());

var express = require('express');
var bodyParser = require('body-parser');
var handler = require('./lib/request-handler.js');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


app.get('/test', (req, res) => {
  res.send('Hello!');
});


app.get('/status', handler.getStatus);

app.post('/signup',  handler.signup);

app.post('/login', handler.login);

app.put('/edit-profile', handler.editProfile);

app.post('/favorites', handler.addFavorites);
app.delete('/favorties', handler.deleteFavorites);

app.get('/feeds', handler.getFeeds);

//app.post('/logout', handler.logout);

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