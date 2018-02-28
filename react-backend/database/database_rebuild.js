const fs = require('fs');
const connect = require('./dbConnection.js');

const rebuild = () => {
  const sql = fs.readFileSync(`${__dirname}/dbBuildTest.sql`).toString();

  connect.query(sql);
};

module.exports = rebuild;
