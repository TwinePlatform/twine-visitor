const dbConnection = require('../dbConnection');

const query = (filterBy, orderBy) =>
  `Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id where activities.cb_id = $1 ${filterBy} ${orderBy}`;

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
      `(users.yearofbirth <= ${getYearOfBirth0_17} and users.yearofbirth > ${getYearOfBirth18_34})`
    );
  if (arrayMatch(filters, 'age@35-50'))
    group.push(
      `(users.yearofbirth <= ${getYearOfBirth18_34} and users.yearofbirth > ${getYearOfBirth35_50})`
    );
  if (arrayMatch(filters, 'age@51-69'))
    group.push(
      `(users.yearofbirth <= ${getYearOfBirth35_50} and users.yearofbirth > ${getYearOfBirth51_69})`
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
  return 'and (' + filterByQuery.join(') AND (') + ')';
};

const getSortQuery = orderBy => {
  if (!orderBy) return '';

  const field = {
    yearofbirth: 'users.yearofbirth',
    sex: 'users.sex',
    activity: 'activities.name',
    date: 'visits.date'
  }[orderBy];

  if (field) return ' ORDER BY ' + field;
  return '';
};

const getVisitsFilteredBy = (cb_id, { filterBy, orderBy }) => {
  const myQuery = query(getFiltersQuery(filterBy), getSortQuery(orderBy));
  console.log(orderBy);
  return new Promise((resolve, reject) => {
    dbConnection
      .query(myQuery, [cb_id])
      .then(res => resolve(res.rows))
      .catch(reject);
  });
};

module.exports = getVisitsFilteredBy;
