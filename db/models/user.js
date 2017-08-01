var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');
var util = require('../../lib/util.js');

var UserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  first_name: String,
  last_name: String,
  email: String,
  avatar: String,
  avoidables: [String],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  shopping_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

UserSchema.statics.getMatchedAvoidables = function(user_id, ingredients, callback) {
  this.findOne({user_id: user_id}, function(err, user) {
    let foundAvoidables = [];

    if (user && user.avoidables.length) {
      foundAvoidables = util.ingredientsMatched(ingredients, user.avoidables);
    }

    callback(foundAvoidables);
  });
};

var User = mongoose.model('User', UserSchema);



module.exports = User;