var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var ProductSchema = new Schema({
  title: String,
  image: String,
  info: String,
  ingredients: [String],
  likes: Number
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;