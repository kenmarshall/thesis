var util = {};

util.ingredientsMatched = function(ingredients, avoidables) {
  var results = [];
  avoidables.forEach(function(item){
    ingredients.forEach(function(ingredient){
        var contains = ingredient.toLowerCase().includes(avoidables.toLowerCase());
        if (contains) {
          results.push(ingredient);
        }
    });
  });

  return results;
}

module.exports = util;