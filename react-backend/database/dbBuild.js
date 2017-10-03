const fs = require('fs');

const dbConnection = require('./dbConnection.js');

const sql = fs.readFileSync(`${__dirname}/dbBuild.sql`).toString();

const runDbBuild = dbConnection.query(sql, (err, res) => {
  if (err) throw err;
  console.log('Database created with the result:  ', res);
});

module.export = runDbBuild;
