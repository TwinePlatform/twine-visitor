const fs = require('fs');
const connect = require('./dbConnection.js');

const rebuild = () =>
  new Promise((resolve, reject) => {
    const sql = fs.readFileSync(`${__dirname}/dbBuild.sql`).toString();

    connect
      .query(sql)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });

module.exports = rebuild;
