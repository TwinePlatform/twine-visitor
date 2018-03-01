const dbConnection = require('../dbConnection');

const query = (filterBy, orderBy) =>
  `SELECT users.id, users.sex, users.yearofbirth, activities.name, visits.date
  FROM users INNER JOIN visits ON users.id=visits.usersid
  INNER JOIN activities ON visits.activitiesid = activities.id
  WHERE activities.cb_id = $1 ${filterBy} ${orderBy}`;

const getValidatedFilters = filterArray => {
  const validFilterTypes = {
    gender: ['male', 'female', 'prefer_not_to_say'],
    age: ['0-17', '18-34', '35-50', '51-69', '70-more']
  };

  return filterArray.reduce((acc, el) => {
    try {
      const [type, filter] = el.split('@');
      const toInsert = acc[type] ? [...acc[type], filter] : [filter];

      return type === 'activity' ||
        (validFilterTypes[type] && validFilterTypes[type].includes(filter))
        ? { ...acc, [type]: toInsert }
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
    prefer_not_to_say: "users.sex = 'prefer not to say'"
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
            '70-more': `(users.yearofbirth <= ${getDate(low)})`
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
    [[], []]
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
  if (!orderBy || typeof orderBy !== 'string') return '';

  const field = {
    yearofbirth: 'users.yearofbirth',
    sex: 'users.sex',
    activity: 'activities.name',
    date: 'visits.date'
  }[orderBy];

  return field ? ` ORDER BY ${field}` : '';
};

// Destructure and supply default arguments
const getVisitsFilteredBy = (cbId, { filterBy = [], orderBy = '' } = {}) => {
  const [filterQueries, values] = combineQueries(filterBy);
  const combinedValues = [cbId, ...values];

  const myQuery = query(filterQueries, getSortQuery(orderBy));

  return dbConnection.query(myQuery, combinedValues).then(res => res.rows);
};

module.exports = getVisitsFilteredBy;
