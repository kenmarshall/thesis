var User = require('../db/models/user.js');
var Product = require('../db/models/product.js');
var prodApi = require('./productApi.js');
var util = require('./util.js');

const sendMatchedAvoidablesResponse = function(req, res, product){

  return function(matchedAvoidables) {
    if (matchedAvoidables.length) {
      res.json({
        productInfo: product.info,
        avoidables: matchedAvoidables,
        status: 'DANGER'
      });
    } else {
      res.json({
        productInfo: product.info,
        status: 'OK'
      });
    }
  };

};

const handleProductAPIResponse = function(req, res) {

  return function(err, product) {
    console.log('product in HANDLE API', product)
    let user_id = req.query.user_id;

    if (!product) {
      res.json({status: 'NOTFOUND'});
      return;
    }

    User.getMatchedAvoidables(req.query.user_id, product.ingredients, sendMatchedAvoidablesResponse(req, res, product));
  }
}

let requestHandler = {};

requestHandler.getStatus = function(req, res){
  Product.findOne({upc: req.query.upc}, function(err, product){
    console.log('product', product)
    if (!product) {
      prodApi.getProductInfo(req.query.upc, handleProductAPIResponse(req, res));
    } else {
      User.getMatchedAvoidables(req.query.user_id, product.ingredients, sendMatchedAvoidablesResponse(req, res, product));
    }
  });
};

requestHandler.getFeeds = function(req, res){
  User.findOne({user_id: req.body.user_id})
}

requestHandler.getFavorites = function(req, res){

  User.findOne({user_id: req.query.user_id})
  .populate('favorites')
  .exec(function(err, user){
    res.json(user.favorites);
  });
}

requestHandler.addFavorites = function(req, res) {
  var newProd = new Product(req.body);

  newProd.save(function(err, product){

    User.findOneAndUpdate(
    {user_id: req.body.user_id},
    {
      $push: {favorites: product._id },
      new: true,
    }, function(err, prod){

      if (err) {
        res.status(500).json({status: 'error'});
      } else {
        res.status(200).json({status: 'success'});
      }

    });
  });

}

requestHandler.deleteFavorites = function(req, res){
  User.findOneAndUpdate({user_id: req.body.user_id},
  {
    $pull: {favorites: req.body._id},
    new: true
  },
  function(err, user){
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json({status:'success'});
  });
}

requestHandler.signup = function(req, res) {
  const newUser = {
    user_id: req.body.user_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    avatar: req.body.avatar
  };

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

  User.findOneAndUpdate({user_id: req.body.user_id}, newUser, {new: true, upsert: true}, function(err, user){
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
