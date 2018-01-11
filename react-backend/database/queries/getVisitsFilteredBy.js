const dbConnection = require('../dbConnection');

const query = filterBy =>
  `Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id where activities.cb_id = $1 ${filterBy}`;

const arrayMatch = (arr, search) => {
  return arr.some(el => el === search);
};
const getFiltersQuery = filterBy => {
  if (!filterBy) return '';

  let filters = filterBy;

  let filterByQuery = [];

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

  // GROUP 2 - activities
  group = filters
    .filter(el => el.match(/^activity@/))
    .map(el => el.replace('activity@', ''))
    .map(el => `activities.name = '${el}'`);

  if (group.length) {
    filterByQuery.push(group.join(' OR '));
    group = [];
  }

  // ----> Finalize

  // I have no filters at all
  if (!filterByQuery.length) return '';

  // I have some filters
  return 'and (' + filterByQuery.join(') AND (') + ')';
};

const getVisitsFilteredBy = (cb_id, filterBy = '') => {
  const filterByQuery = query(getFiltersQuery(filterBy));
  // const filterByQuery = {
  //   male: query("users.sex = 'male'"),
  //   female: query("users.sex = 'female'"),
  //   prefer_not_to_say: query("users.sex = 'prefer not to say'")
  // }[filterBy];

  return new Promise((resolve, reject) => {
    // if (!filterByQuery)
    //   return reject(new Error('Incorrect filterBy supplied to query'));

    dbConnection
      .query(filterByQuery, [cb_id])
      .then(res => resolve(res.rows))
      .catch(reject);
  });
};

module.exports = getVisitsFilteredBy;
