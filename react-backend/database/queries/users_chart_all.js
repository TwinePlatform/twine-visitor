const dbConnection = require('../dbConnection');

const getActivitiesQuery = 'SELECT name FROM activities WHERE cb_id=$1';

const getGenderNumbersQuery =
  'SELECT sex, COUNT(sex) FROM users WHERE cb_id = $1 GROUP BY sex';

const getActivitiesNumbersQuery =
  'SELECT activities.name, COUNT(visits.usersId) FROM activities, visits WHERE activities.id = visits.activitiesId AND activities.cb_id = $1 GROUP BY activities.name';

const today = new Date();
const getYearOfBirth0_17 = today.getFullYear() - 17;
const getYearOfBirth18_34 = today.getFullYear() - 34;
const getYearOfBirth35_50 = today.getFullYear() - 50;
const getYearOfBirth51_69 = today.getFullYear() - 69;
// const getYearOfBirth70_more = today.getFullYear() - 70;

const getVisitsNumbersQuery =
  "SELECT date_part('epoch',date)*1000 as date FROM visits WHERE cb_id = $1";

const getVisitorsByAge = `WITH groupage AS (SELECT CASE
  WHEN yearofbirth > ${getYearOfBirth0_17} THEN '0-17'
  WHEN yearofbirth > ${getYearOfBirth18_34} AND yearofbirth <= ${getYearOfBirth0_17} THEN '18-34'
  WHEN yearofbirth > ${getYearOfBirth35_50} AND yearofbirth <= ${getYearOfBirth18_34} THEN '35-50'
  WHEN yearofbirth > ${getYearOfBirth51_69} AND yearofbirth <= ${getYearOfBirth35_50} THEN '51-69'
  WHEN yearofbirth <= ${getYearOfBirth51_69} THEN '70+'
  END AS ageGroups
  FROM users WHERE cb_id = $1)
  SELECT COUNT(ageGroups) AS ageCount, ageGroups
  FROM groupage
  GROUP BY ageGroups`;

const genderNumbers = cbId => {
  if (!cbId)
    return Promise.reject(new Error('No Community Business ID supplied'));

  return Promise.all([
    dbConnection.query(getVisitsNumbersQuery, [cbId]),
    dbConnection.query(getGenderNumbersQuery, [cbId]),
    dbConnection.query(getActivitiesNumbersQuery, [cbId]),
    dbConnection.query(getVisitorsByAge, [cbId]),
    dbConnection.query(getActivitiesQuery, [cbId])
  ]).then(
    ([
      resultVisitsCount,
      resultGenderCount,
      resultActivitiesCount,
      resultVisitorsByAge,
      resultActivities
    ]) => [
      resultVisitsCount.rows,
      resultGenderCount.rows,
      resultActivitiesCount.rows,
      resultVisitorsByAge.rows,
      resultActivities.rows
    ]
  );
};

module.exports = genderNumbers;
