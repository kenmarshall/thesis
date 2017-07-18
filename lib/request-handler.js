var User = require('../db/models/user.js');
var prodApi = require('./productApi.js');
var _ = require('lodash');


let requestHandler = {};

requestHandler.getStatus = function(req, res){


  prodApi.getProductInfo(req.query.upc, function(err, response){


    const result = JSON.parse(response.body);



    if (err) {
      console.error(err);
      res.send(err);
      return;
    }


    const ingredients = _.map(result.results.product_ingredients, function(obj) {
      return obj.name.toLowerCase();
    });




    User.findOne({username: req.query.username}, function(user){
      const foundAvoidables = _.intersection(user.avoidables, ingredients);
      if (foundAvoidables.length) {
        res.json({status: 'DANGER'});
      } else {
        res.json({status: 'OK'});
      }
    });
 });
};

requestHandler.signup = function(req, res) {

  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
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