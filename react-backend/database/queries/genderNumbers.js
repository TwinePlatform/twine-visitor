const dbConnection = require('../dbConnection');

const getGenderNumbersQuery =
  'SELECT sex, COUNT(sex) FROM users WHERE cb_id = $1 GROUP BY sex';

const genderNumbers = cbId =>
  new Promise((resolve, reject) => {
    if (!cbId) return reject(new Error('No Community Business ID supplied'));

    dbConnection
      .query(getGenderNumbersQuery, [cbId])
      .then(res => resolve(res.rows))
      .catch(reject);
  });

module.exports = genderNumbers;
