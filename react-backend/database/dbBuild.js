const fs = require('fs');

const dbConnection = require('./dbConnection.js');

const sql = fs.readFileSync(`${__dirname}/dbBuild.sql`).toString();

const runDbBuild = dbConnection
  .query(sql)
  .then(() => {
    dbConnection.end();
  })
  .catch(err => {
    throw err;
  });

module.export = runDbBuild;
