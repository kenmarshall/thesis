var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var UserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: {
      unique: true,
    }
  },
  first_name: String,
  last_name: String,
  email: String,
  avatar: String,
  avoidables: [String],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;