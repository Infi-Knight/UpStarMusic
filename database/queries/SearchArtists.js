const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  // ({ [sortProperty]: 1 }) is es6 shortcut to create an object on the fly
  // with a given value
  const query = Artist.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit);

  // Artist..count() is an async operation which returns a promise that resolves
  // with total number of records in our database
  // buildQuery will return a query object looking like:
  // {age: {$gte: minAge, $lte: maxAge}}
  // $gte etc are monog operators
  return Promise.all([query, Artist.find(buildQuery(criteria)).count()]).then(
    results => ({
      all: results[0],
      count: results[1],
      offset,
      limit
    })
  );
};

const buildQuery = criteria => {
  const query = {};

  // to use for $text operator we need to create an index of the
  // property for which we are doing a text search. In our case we are doing
  // a text search on the 'name' property so we need an index of names
  // which will enable mongo for efficient lookups
  // currently mongo supports indexes for one property only
  // To create a 'text' index.
  // 1- Go to mongo shell, switch to your database
  // 2- run the command:
  // db.YOUR_COLLECTION_NAME.createIndex({PROPERTY_NAME: "text"})

  // by default mongo keeps an index of _id
  if (criteria.name) {
    query.$text = {
      $search: criteria.name
    };
  }

  if (criteria.age) {
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max
    };
  }

  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    };
  }

  return query;
};
