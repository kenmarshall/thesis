var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  avoidables: [String],
  password: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;