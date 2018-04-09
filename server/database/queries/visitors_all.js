const getAllUsersQuery = `
  SELECT visits.id AS visit_id, users.id AS visitor_id, users.sex AS gender, users.yearofbirth AS yob, activities.name AS activity, visits.date AS visit_date
  FROM users
  INNER JOIN visits ON users.id=visits.usersid
  INNER JOIN activities ON visits.activitiesid = activities.id
  WHERE activities.cb_id = $1`;

const getAllUsers = (dbConnection, cbId) =>
  dbConnection.query(getAllUsersQuery, [cbId]).then(res => res.rows);

module.exports = getAllUsers;
