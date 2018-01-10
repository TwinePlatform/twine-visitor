const dbConnection = require('../dbConnection');

const query = orderBy =>
  `SELECT users.id, users.sex, users.yearofbirth, activities.name, visits.date
  FROM users
  INNER JOIN visits ON users.id=visits.usersid
  INNER JOIN activities ON visits.activitiesid = activities.id
  WHERE activities.cb_id = $1
  ORDER BY ${orderBy}`;

const getVisitsFilteredBy = (cbId, orderBy) => {
  const orderByQuery = {
    yearofbirth: query('users.yearofbirth'),
    sex: query('users.sex'),
    activity: query('activities.name'),
    date: query('visits.date'),
  }[orderBy];

  return new Promise((resolve, reject) => {
    if (!orderByQuery)
      return reject(new Error('Incorrect orderBy supplied to query'));

    dbConnection
      .query(orderByQuery, [cbId])
      .then(res => resolve(res.rows))
      .catch(reject);
  });
};

module.exports = getVisitsFilteredBy;
