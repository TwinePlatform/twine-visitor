const dbConnection = require('../dbConnection');

const query = (filterBy, orderBy) => `
SELECT DISTINCT ON (users.id) users.id, users.fullName, users.sex, users.yearofbirth, users.email, users.date
FROM users
FULL OUTER JOIN visits
ON visits.usersId = users.id
FULL OUTER JOIN activities
ON activities.id = visits.activitiesId
WHERE users.cb_id = $1 ${filterBy} ${orderBy}`;

const getValidatedFilters = filterArray => {
  const validFilterTypes = {
    gender: ['male', 'female', 'prefer_not_to_say'],
    age: ['0-17', '18-34', '35-50', '51-69', '70-more'],
  };

  return filterArray.reduce((acc, el) => {
    try {
      const [type, filter] = el.split('@');
      const toInsert = acc[type] ? [...acc[type], filter] : [filter];

      return type === 'activity' ||
        (validFilterTypes[type] && validFilterTypes[type].includes(filter))
        ? Object.assign(acc, { [type]: toInsert })
        : acc;
    } catch (error) {
      return acc;
    }
  }, {});
};

const buildGenderQuery = genderQueries => {
  const validQueries = {
    male: "users.sex = 'male'",
    female: "users.sex = 'female'",
    prefer_not_to_say: "users.sex = 'prefer not to say'",
  };

  return genderQueries
    ? genderQueries.map(gender => validQueries[gender]).join(' OR ')
    : '';
};

const getDate = age => {
  const today = new Date();
  return today.getFullYear() - age;
};

const buildAgeQuery = ageQuery =>
  ageQuery
    ? ageQuery
        .map(ageRange => {
          const [low, high] = ageRange.split('-').map(num => Number(num));
          const edgeCaseQuery = {
            '0-17': `(users.yearofbirth > ${getDate(high)})`,
            '70-more': `(users.yearofbirth <= ${getDate(low)})`,
          }[ageRange];

          return (
            edgeCaseQuery ||
            `(users.yearofbirth <= ${getDate(low - 1)}
            AND users.yearofbirth > ${getDate(high)})`
          );
        })
        .join(' OR ')
    : '';

const buildActivityQueries = validFilters => {
  if (!validFilters) return ['', []];

  const [queries, values] = validFilters.reduce(
    (acc, activity, index) => {
      const [queries, values] = acc;
      // $ values taking into account 0 index and the cb_id that's already set
      const newQuery = [...queries, `activities.name = $${index + 2}`];
      const newValue = [...values, activity];

      return [newQuery, newValue];
    },
    [[], []],
  );

  return [queries.join(' OR '), values];
};

const buildFilterQueries = validFilters => {
  const genderQuery = buildGenderQuery(validFilters.gender);
  const ageQuery = buildAgeQuery(validFilters.age);

  const [activQuery, activValue] = buildActivityQueries(validFilters.activity);

  const combinedQueries = [genderQuery, ageQuery, activQuery]
    .map(query => (query ? `AND (${query}) ` : ''))
    .join('');

  return [combinedQueries, activValue];
};

const combineQueries = filterBy =>
  buildFilterQueries(getValidatedFilters(filterBy));

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

const visitorsByAge = filterBy => `WITH filteredUsers AS
(
  SELECT DISTINCT ON (users.id) users.id, users.yearofbirth
  FROM users
  FULL OUTER JOIN visits
  ON visits.usersId = users.id
  FULL OUTER JOIN activities
  ON activities.id = visits.activitiesId
  WHERE users.cb_id = $1 ${filterBy}
),
groupage AS (SELECT CASE
  WHEN filteredUsers.yearofbirth > ${getDate(17)} THEN '0-17'
  WHEN filteredUsers.yearofbirth > ${getDate(
    34,
  )} AND filteredUsers.yearofbirth <= ${getDate(17)} THEN '18-34'
  WHEN filteredUsers.yearofbirth > ${getDate(
    50,
  )} AND filteredUsers.yearofbirth <= ${getDate(34)} THEN '35-50'
  WHEN filteredUsers.yearofbirth > ${getDate(
    69,
  )} AND filteredUsers.yearofbirth <= ${getDate(50)} THEN '51-69'
  WHEN filteredUsers.yearofbirth <= ${getDate(69)} THEN '70+'
  END AS ageGroups
  FROM filteredUsers
)
  SELECT COUNT(ageGroups) AS ageCount, ageGroups
  FROM groupage
  GROUP BY ageGroups`;

const activitiesNumbersQuery = filterBy =>
  `SELECT activities.name, COUNT(visits.usersId) FROM activities, visits, users WHERE activities.id = visits.activitiesId AND users.id = visits.usersId AND activities.cb_id = $1
  ${filterBy} GROUP BY activities.name`;

const genderNumbersQuery = filterBy => `WITH filteredUsers AS
(
  SELECT DISTINCT ON (users.id)
  users.id, users.sex
  FROM users
  FULL OUTER JOIN visits
  ON visits.usersId = users.id
  FULL OUTER JOIN activities
  ON activities.id = visits.activitiesId
  WHERE users.cb_id = $1 ${filterBy}
)
  SELECT filteredUsers.sex, COUNT(filteredUsers.sex) FROM filteredUsers

  GROUP BY filteredUsers.sex`;

const getUsersFilteredBy = (cb_id, { filterBy = [], orderBy = '' } = {}) =>
  new Promise((resolve, reject) => {
    if (!cb_id) return reject(new Error('No Community Business ID supplied'));
    const [filterQueries, values] = combineQueries(filterBy);
    const combinedValues = [cb_id, ...values];

    const myQuery = query(filterQueries, getSortQuery(orderBy));
    //     const myQuery = `SELECT users.id, users.fullName, users.sex, users.yearofbirth, users.email, users.date
    // FROM users
    // INNER JOIN visits
    // ON visits.usersId = users.id
    // INNER JOIN activities
    // ON activities.id = visits.activitiesId
    // WHERE users.cb_id = $1 AND (activities.name = $2)`;
    const getVisitorsByAge = visitorsByAge(filterQueries);
    const getActivitiesNumbers = activitiesNumbersQuery(filterQueries);
    const getGenderNumbers = genderNumbersQuery(filterQueries);
    // console.log(myQuery, combinedValues);
    // dbConnection
    //   .query(myQuery, combinedValues)
    //   .then(res => {
    //     console.log(getVisitorsByAge);
    //     return dbConnection.query(getVisitorsByAge, combinedValues);
    //   })
    //   .then(console.log)
    //   .catch(reject);
    Promise.all([
      dbConnection.query(myQuery, combinedValues),
      dbConnection.query(getVisitorsByAge, combinedValues),
      dbConnection.query(getActivitiesNumbers, combinedValues),
      dbConnection.query(getGenderNumbers, combinedValues),
    ])
      .then(
        ([
          resultGeneral,
          resultVisitorsByAge,
          resultActivitiesNumbers,
          resultGenderNumbers,
        ]) => [
          resultGeneral.rows,
          resultVisitorsByAge.rows,
          resultActivitiesNumbers.rows,
          resultGenderNumbers.rows,
        ],
      )
      .then(res => resolve(res))
      .catch(reject);
  });

module.exports = getUsersFilteredBy;
