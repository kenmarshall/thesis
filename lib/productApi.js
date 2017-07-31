const request = require('request');
const FOOD_FACTS_URL =  'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc/format/json';
const _ = require('lodash');
const access = require('../config/foodAPI.js');

let productApi = {};

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

        // const nutrients =  _.map(result.results.product_ingredients, function(obj) {
        //   return obj.name;
        // });

        product = {
          upc: result.results.product_detail.product_upc,
          title: result.results.product_detail.title,
          brand: result.results.product_detail.brand,
          catergory: result.results.product_detail.main_category_name,
          'sub_category': result.results.product_detail.sub_category_name,
          image: result.results.product_detail.product_image,
          ingredients: ingredients
        };

      }
      callback(err, product);
    });
}

module.exports = productApi;
