var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require ('../config');

var FeedSchema = new Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

var Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;