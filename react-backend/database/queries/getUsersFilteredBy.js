const dbConnection = require('../dbConnection');

const query = (filterBy, orderBy) => `
SELECT users.id, users.fullName, users.sex, users.yearofbirth, users.email, users.date
FROM users
WHERE users.cb_id = $1 ${filterBy} ${orderBy}`;

const arrayMatch = (arr, search) => arr.some(el => el === search);

const getFiltersQuery = filterBy => {
  if (!filterBy) return '';

  const filters = filterBy;

  const filterByQuery = [];

  let group = [];

  // GROUP 1 - Gender
  if (arrayMatch(filters, 'gender@male')) group.push("users.sex = 'male'");

  if (arrayMatch(filters, 'gender@female')) group.push("users.sex = 'female'");

  if (arrayMatch(filters, 'gender@prefer_not_to_say'))
    group.push("users.sex = 'prefer not to say'");

  if (group.length) {
    filterByQuery.push(group.join(' OR '));
    group = [];
  }

  // GROUP 3 - age
  const today = new Date();
  const getYearOfBirth0_17 = today.getFullYear() - 17;
  const getYearOfBirth18_34 = today.getFullYear() - 34;
  const getYearOfBirth35_50 = today.getFullYear() - 50;
  const getYearOfBirth51_69 = today.getFullYear() - 69;
  const getYearOfBirth70_more = today.getFullYear() - 70;
  if (arrayMatch(filters, 'age@0-17'))
    group.push(`(users.yearofbirth > ${getYearOfBirth0_17})`);
  if (arrayMatch(filters, 'age@18-34'))
    group.push(
      `(users.yearofbirth <= ${getYearOfBirth0_17} and users.yearofbirth > ${getYearOfBirth18_34})`,
    );
  if (arrayMatch(filters, 'age@35-50'))
    group.push(
      `(users.yearofbirth <= ${getYearOfBirth18_34} and users.yearofbirth > ${getYearOfBirth35_50})`,
    );
  if (arrayMatch(filters, 'age@51-69'))
    group.push(
      `(users.yearofbirth <= ${getYearOfBirth35_50} and users.yearofbirth > ${getYearOfBirth51_69})`,
    );
  if (arrayMatch(filters, 'age@70-more'))
    group.push(`(users.yearofbirth <= ${getYearOfBirth51_69})`);

  if (group.length) {
    filterByQuery.push(group.join(' OR '));
    group = [];
  }

  // ----> Finalize

  // I have no filters at all
  if (!filterByQuery.length) return '';

  // I have some filters
  console.log(filterByQuery);
  return `and (${filterByQuery.join(') AND (')})`;
};

const getSortQuery = orderBy => {
  if (!orderBy) return '';

  const field = {
    name: 'users.fullName',
    yearofbirth: 'users.yearofbirth',
    sex: 'users.sex',
    email: 'users.email',
    date: 'users.date',
  }[orderBy];

  if (field) return ` ORDER BY ${field}`;
  return '';
};

const today = new Date();
const getYearOfBirth0_17 = today.getFullYear() - 17;
const getYearOfBirth18_34 = today.getFullYear() - 34;
const getYearOfBirth35_50 = today.getFullYear() - 50;
const getYearOfBirth51_69 = today.getFullYear() - 69;
const getYearOfBirth70_more = today.getFullYear() - 70;

const visitorsByAge = filterBy => `WITH groupage AS (SELECT CASE
  WHEN users.yearofbirth > ${getYearOfBirth0_17} THEN '0-17'
  WHEN users.yearofbirth > ${getYearOfBirth18_34} AND users.yearofbirth <= ${getYearOfBirth0_17} THEN '18-34'
  WHEN users.yearofbirth > ${getYearOfBirth35_50} AND users.yearofbirth <= ${getYearOfBirth18_34} THEN '35-50'
  WHEN users.yearofbirth > ${getYearOfBirth51_69} AND users.yearofbirth <= ${getYearOfBirth35_50} THEN '51-69'
  WHEN users.yearofbirth <= ${getYearOfBirth51_69} THEN '70+'
  END AS ageGroups
  FROM users WHERE cb_id = $1 ${filterBy})
  SELECT COUNT(ageGroups) AS ageCount, ageGroups
  FROM groupage
  GROUP BY ageGroups`;

const activitiesNumbersQuery = filterBy =>
  `SELECT activities.name, COUNT(visits.usersId) FROM activities, visits, users WHERE activities.id = visits.activitiesId AND users.id = visits.usersId AND activities.cb_id = $1 ${filterBy} GROUP BY activities.name`;

const getUsersFilteredBy = (cb_id, { filterBy, orderBy }) =>
  new Promise((resolve, reject) => {
    if (!cb_id) return reject(new Error('No Community Business ID supplied'));
    const myQuery = query(getFiltersQuery(filterBy), getSortQuery(orderBy));
    const getVisitorsByAge = visitorsByAge(getFiltersQuery(filterBy));
    const getActivitiesNumbers = activitiesNumbersQuery(
      getFiltersQuery(filterBy),
    );
    Promise.all([
      dbConnection.query(myQuery, [cb_id]),
      dbConnection.query(getVisitorsByAge, [cb_id]),
      dbConnection.query(getActivitiesNumbers, [cb_id]),
    ])
      .then(([resultGeneral, resultVisitorsByAge, resultActivitiesNumbers]) => [
        resultGeneral.rows,
        resultVisitorsByAge.rows,
        resultActivitiesNumbers.rows,
      ])
      .then(res => resolve(res))
      .catch(reject);
  });

module.exports = getUsersFilteredBy;
