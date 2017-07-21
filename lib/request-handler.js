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




    User.findOne({user_id: req.query.user_id}, function(user){
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
  //var avoidables = req.body.avoidables.split(',');
  const newUser = {
    user_id: req.body.user_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    avatar: req.body.avatar
   // avoidables: avoidables
  };

  User.create(newUser, function(user){
    res.status(201).json(user);
  });
};

requestHandler.editProfile = function(req, res) {
  var avoidables = req.body.avoidables.split(',');


  const newUser = {};


  if (req.body.first_name) {
    newUser.first_name = req.body.first_name;
  }

  if (req.body.last_name) {
    newUser.last_name = req.body.last_name;
  }

  if (req.body.avatar) {
    newUser.avatar = req.body.avatar;
  }

  if (req.body.avoidables) {
    newUser.avoidables = avoidables;
  }




  User.findOneAndUpdate({user_id: req.body.user_id}, newUser, {new: true, upsert:true}, function(err, user){
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(user);
    }
  });

};

requestHandler.login = function(req, res) {
  User.findOne({user_id: req.body.user_id}, function(err, user){
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