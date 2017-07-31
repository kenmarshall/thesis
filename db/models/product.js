var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var ProductSchema = new Schema({
  upc: String,
  title: String,
  brand: String,
  category: String,
  sub_catergory: String,
  image: String,
  info: String,
  nutrients: [],
  ingredients: [String],
  likes: Number,
  reviews:[]
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;