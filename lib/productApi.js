const request = require('request');
const FOOD_FACTS_URL =  'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc';
let productApi = {};

productApi.getProductInfo = function(upc, callback) {
  request
    .post(FOOD_FACTS_URL + '/format/json',
    {
      login: 'kenmarshall-dev101',
      password: 'L6D1AhJ#*37q',
      upc: upc
    }, function(err, response, body){
      console.log(response);
      callback(response);
    }
  );
}

module.exports = productApi;
