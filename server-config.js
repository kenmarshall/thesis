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

app.get('/modelTest', handler.testModel);

app.get('/status', handler.getStatus);

app.post('/signup',  handler.signup);

app.post('/login', handler.login);

app.put('/edit-profile', handler.editProfile);


app.get('/favorites', handler.getFavorites);

app.post('/favorites', handler.addFavorites);

app.delete('/favorite', handler.deleteFavorite);

app.delete('/favorites', handler.deleteFavorites);


app.get('/shopping-list', handler.getShoppingList);

app.post('/shopping-list', handler.addToShoppingList);

app.delete('/shopping-list-item', handler.deleteShoppingListItem);

app.delete('/shopping-list', handler.deleteShoppingList);


app.post('/shopping-list/email', handler.emailShoppingList);

app.post('/shopping-list/text', handler.textShoppingList);

app.get('/feeds', handler.getFeeds);

module.exports = app;
