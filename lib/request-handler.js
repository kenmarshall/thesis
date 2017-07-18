var User = require('../db/models/user.js');
var prodApi = require('./productApi.js');


let requestHandler = {};

const requestHandler.getStatus = function(req, res){
  prodApi.getProductInfo(req.params.upc, function(response){
    console.log("=== response ===", response);
    res.json(response);
  });
};

requestHandler.signup = function(req, res) {

  const newUser = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    avoidables: req.body.avoidables
  }

  User.create(newUser, function(user){
    res.status(201).json(user);
  });
};

requestHandler.login = function(req, res) {
  User.findOne({username:req.body.username}, function(err, user){
    if (err) {
      res.status(403).send(err);
    } else {
      res.status(200).json(user);
    }
  });
};

requestHandler.logout = function(req, res) {

};

module.exports = requestHandler;