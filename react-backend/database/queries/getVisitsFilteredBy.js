const dbConnection = require('../dbConnection');

const query = orderBy =>
  `Select users.id, users.sex, users.yearofbirth, activities.name, visits.date from users inner join visits on users.id=visits.usersid inner join activities on visits.activitiesid = activities.id where activities.cb_id = $1 order by ${orderBy}`;

const getVisitsFilteredBy = (cb_id, orderBy) => {
  const orderByQuery = {
    yearofbirth: query('users.yearofbirth'),
    sex: query('users.sex'),
    activity: query('activities.name'),
    date: query('visits.date'),
  }[orderBy];
  return new Promise((resolve, reject) => {
    if (!orderByQuery) return reject(new Error('Incorrect orderBy supplied to query'));

    dbConnection
      .query(orderByQuery, [cb_id])
      .then(res => resolve(res.rows))
      .catch(reject);
  });
};

module.exports = getVisitsFilteredBy;
