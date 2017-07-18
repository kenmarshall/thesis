const request = require('request');
const FOOD_FACTS_URL =  'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc/format/json';
let productApi = {};

productApi.getProductInfo = function(upc, callback) {

  request
    .post({
      url: FOOD_FACTS_URL,
      form:  {
        login: 'suyatdesign',
        password: 'KMS-Squar3d!',
        upc: upc
      }
    }, function(err, response, body){
      console.log('===== request =====');
      callback(err, response);
    });
}

module.exports = productApi;
