const dbConnection = require('../dbConnection');

const getGenderNumbersQuery =
  'SELECT sex, COUNT(sex) FROM users WHERE cb_id = $1 GROUP BY sex';

const getActivitiesNumbersQuery =
  'SELECT activities.name, COUNT(visits.usersId) FROM activities, visits WHERE activities.id = visits.activitiesId AND activities.cb_id = $1 GROUP BY activities.name';

const genderNumbers = cbId =>
  new Promise((resolve, reject) => {
    if (!cbId) return reject(new Error('No Community Business ID supplied'));

    Promise.all([
      dbConnection.query(getGenderNumbersQuery, [cbId]),
      dbConnection.query(getActivitiesNumbersQuery, [cbId]),
    ])
      .then(([resultGenderCount, resultActivitiesCount]) => [
        resultGenderCount.rows,
        resultActivitiesCount.rows,
      ])
      .then(res => resolve(res))
      .catch(reject);
  });

module.exports = genderNumbers;
