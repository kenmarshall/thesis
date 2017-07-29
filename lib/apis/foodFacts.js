const request = require('request');
const URL =  'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc/format/json';
const credentials = require('../config/credentials.js');


const extractIngredients = function(result){
  let ingredients = [];

  if (result && result.results){
    ingredients = _.map(result.results.product_ingredients, function(obj) {
      return obj.name;
    });
  }

  return ingredients;
};

const handleResponse = function(callback){

  return function(err, response, body){
    const result = JSON.parse(response.body);
    let product;

    if (result && result.results) {
      product = {};
      product.info = result.results.product_detail;
      product.ingredients = extractIngredients(result);
    }
    callback(err, product);
  }

};


foodFacts = {};

foodFacts.fetchProductByUpc = function(upc, callback) {
  let product;

  let config = {
    url: URL,
    form:  {
      login: access.username,
      password: access.password,
      upc: upc
    }
  };

  request.post(config, handleResponse(callback));

};

foodFacts.fetchProductsByCatergory = function(catergory, callback){
  callback(err, []);
}

module.exports = foodFacts;