const request = require('request');
const FOOD_FACTS_URL =  'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc/format/json';
let productApi = {};
var _ = require('lodash');
const access = require('./config/foodAPI.js');

productApi.getProductInfo = function(upc, callback) {
  var product;

  request
    .post({
      url: FOOD_FACTS_URL,
      form:  {
        login: access.username,
        password: access.password,
        upc: upc
      }
    }, function(err, response, body){
      const result = JSON.parse(response.body);

      if (result && result.results) {
        const ingredients = _.map(result.results.product_ingredients, function(obj) {
          return obj.name;
        });
        product = {};
        product.info = result.results.product_detail;
        product.ingredients = ingredients;
      }

       callback(err, product);

    });
}

module.exports = productApi;
