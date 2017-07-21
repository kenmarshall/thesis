var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var UserSchema = new Schema({
  user_id: String,
  first_name: String,
  last_name: String,
  email: String,
  avatar: String,
  avoidables: [String],
});

var User = mongoose.model('User', UserSchema);

module.exports = User;