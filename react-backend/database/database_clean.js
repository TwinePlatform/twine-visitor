const connect = require('./dbConnection.js');

const clean = () =>
  connect.query('TRUNCATE TABLE users, visits, activities, cbusiness;');

module.exports = clean;
