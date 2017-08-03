var User = require('../db/models/user.js');
var Product = require('../db/models/product.js');
var prodApi = require('./productApi.js');
var util = require('./util.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: 'kms.squared24@gmail.com',
    pass: 'KMS-Squared!'
  }
}));

const sendMatchedAvoidablesResponse = function(req, res, product){

  return function(matchedAvoidables) {
    if (matchedAvoidables.length) {
      res.json({
        productInfo: product,
        avoidables: matchedAvoidables,
        status: 'DANGER'
      });
    } else {
      res.json({
        productInfo: product,
        status: 'OK'
      });
    }
  };

};

const handleProductAPIResponse = function(req, res) {

  return function(err, product) {

    let user_id = req.query.user_id;
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    if (!product) {
      res.json({status: 'NOTFOUND'});
      return;
    }

    Product.create(product, function(){
       User.getMatchedAvoidables(req.query.user_id, product.ingredients, sendMatchedAvoidablesResponse(req, res, product));
    });
  }
}

let requestHandler = {};

requestHandler.getStatus = function(req, res){

  Product.findOne({upc: req.query.upc}, function(err, product){

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
  User.findOne({user_id: req.body.user_id}).populate('favorites').exec(function(err, user){
    if (err) {
      res.status(403).send(err);
    } else {
      res.status(200).json(user);
    }
  });
};

requestHandler.getFavorites = function(req, res){

  User.findOne({user_id: req.query.user_id})
  .populate('favorites')
  .exec(function(err, user){
    res.json(user.favorites);
  });
}

requestHandler.addFavorites = function(req, res) {


    User.findOneAndUpdate(
    {user_id: req.body.user_id},
    {
      $addToSet: {favorites: req.body.product_id }
    },
    {
      new: true
    },
    function(err, prod){

      if (err) {
        res.status(500).json({status: 'error'});
      } else {
        res.status(200).json({status: 'success'});
      }
    });


}

requestHandler.deleteFavorite = function(req, res){
  User.findOneAndUpdate({user_id: req.body.user_id},
  {
    $pull: {favorites: req.body.product_id},

  },
  {
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

requestHandler.deleteFavorites = function(req, res){
  User.findOneAndUpdate({user_id: req.body.user_id},
  {
    favorites: []
  },
  {
    new: true
  },
  function(err, user){
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json({status:'success'});
  });
};

requestHandler.getShoppingList = function(req, res){
  User.findOne({user_id: req.query.user_id})
  .populate('shopping_list').exec(function(err, user){
    if (err) {
      res.json(err);
    } else {
      res.json(user['shopping_list']);
    }
  });
};

requestHandler.addToShoppingList = function(req, res){
  User.findOneAndUpdate(
    {user_id: req.body.user_id},
    {
      $addToSet: {shopping_list: req.body.product_id },
    },
    {
      new: true
    }, function(err, prod){

      if (err) {
        res.status(500).json({status: 'error'});
      } else {
        res.status(200).json({status: 'success'});
      }
    });
};

requestHandler.deleteShoppingListItem = function(){

  User.findOneAndUpdate({user_id: req.body.user_id},
  {
    $pull: {shopping_list: req.body.product_id}
  },
  {
    new: true
  },
  function(err, user){
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json({status:'success'});
  });
};

requestHandler.deleteShoppingList = function(){

  User.findOneAndUpdate({user_id: req.body.user_id},
  {
    shopping_list: [],
  },
  {
    new: true
  },
  function(err, user){
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json({status:'success'});
  });
};

var buildEmailHtmlTemplate = function(list){
  var html = '';
  list.forEach(function(item) {
   html += `<img style="width:80px;height:80px" src="${item.image}"/>
     <h4>${item.title}</h4>
     <hr/>`;
  });

  return html;
};

requestHandler.logout = function(req, res) {

};

var sendEmail = function() {

}

requestHandler.emailShoppingList = function(req, res) {

  User.findOne({user_id: req.body.user_id})
  .populate('shopping_list')
  .exec(function(err, user){
    var html = buildEmailHtmlTemplate(user.shopping_list);

    if (user) {
      transporter.sendMail({
        from: 'support@kmssquared.com',
        to: req.body.recipientEmail,
        subject: `${user.first_name} shared his shopping list with you`,
        html: html
      }).then(function(){
        res.json({status: 'email sent'});
      }).catch(function(err) {
        res.json({error: err});
      });
    } else {
      res.json({status: 'no user'});
    }
  });
};

requestHandler.textShoppingList = function(req, res) {

}

requestHandler.testModel = function(req, res) {
  Product.findOne({upc: '123'}, function(err, product){


    if (!product){
      console.log('===no product===', product);
      Product.create({upc:'123'});
    } else {
      console.log('===err===', err);
    console.log('===product===', product);
    }

    res.send('====OK====\n');
  });
}

module.exports = requestHandler;
