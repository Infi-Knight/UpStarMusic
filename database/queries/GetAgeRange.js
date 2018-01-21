const Artist = require('../models/artist');

/**
 * Finds the lowest and highest age of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max ages, like { min: 16, max: 45 }.
 */
module.exports = () => {
  // any subsequent .then on minQuery will be called with age
  const minQuery = Artist.find({})
    .sort({ age: 1 })
    .limit(1)
    .then(artists => artists[0].age);

  const maxQuery = Artist.find({})
    .sort({ age: -1 })
    .limit(1)
    .then(artists => artists[0].age);

  // es6 implicit objec return
  // result will be resolved with ages min from minQuery and
  // max from maxQuery
  return Promise.all([minQuery, maxQuery]).then(result => ({
    min: result[0],
    max: result[1]
  }));
};
