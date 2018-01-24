const dbConnection = require('../dbConnection');

const query = (filterBy, orderBy) => `
SELECT users.id, users.fullName, users.sex, users.yearofbirth, users.email, users.date
FROM users
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

const genderNumbersQuery = filterBy =>
  `SELECT users.sex, COUNT(users.sex) FROM users WHERE users.cb_id = $1 ${filterBy} GROUP BY users.sex`;

const getUsersFilteredBy = (cb_id, { filterBy = [], orderBy = '' } = {}) =>
  new Promise((resolve, reject) => {
    if (!cb_id) return reject(new Error('No Community Business ID supplied'));
    const [filterQueries, values] = combineQueries(filterBy);
    const combinedValues = [cb_id, ...values];

    const myQuery = query(filterQueries, getSortQuery(orderBy));
    const getVisitorsByAge = visitorsByAge(filterQueries);
    const getActivitiesNumbers = activitiesNumbersQuery(filterQueries);
    const getGenderNumbers = genderNumbersQuery(filterQueries);
    Promise.all([
      dbConnection.query(myQuery, [cb_id]),
      dbConnection.query(getVisitorsByAge, [cb_id]),
      dbConnection.query(getActivitiesNumbers, [cb_id]),
      dbConnection.query(getGenderNumbers, [cb_id]),
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
