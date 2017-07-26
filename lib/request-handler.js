var User = require('../db/models/user.js');
var prodApi = require('./productApi.js');
var _ = require('lodash');
var util = require('./util.js');


let requestHandler = {};

requestHandler.getStatus = function(req, res){


  prodApi.getProductInfo(req.query.upc, function(err, product){

    if (!product) {
      res.json({status: 'NOTFOUND'});
    }

    User.findOne({user_id: req.query.user_id}, function(err, user){
      const foundAvoidables = util.ingredientsMatched(product.ingrendients, user.avoidables);

      if (foundAvoidables.length) {
        res.json({
          productInfo: product.info,
          avoidables: foundAvoidables,
          status: 'DANGER'
        });
      } else {
        res.json({
          productInfo: productInfo,
          status: 'OK'
        });
      }
    });
 });
};

requestHandler.addFavorites = function(req, res){
  User.findOne({user_id: req.body.user_id})
}

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
  console.log('newUser ', newUser);
  console.log('request body ', req.body);

  User.create(newUser, function(err, user){
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