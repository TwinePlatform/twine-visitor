const getAllVisitsQuery = `
  SELECT visits.id AS visit_id, users.fullName AS visitor_name, users.sex AS gender, users.yearofbirth AS yob, activities.name AS activity, visits.date AS visit_date
  FROM users
  INNER JOIN visits ON users.id=visits.usersid
  INNER JOIN activities ON visits.activitiesid = activities.id
  WHERE activities.cb_id = $1
  ORDER BY visit_date DESC`;

const getAllVisits = (dbConnection, cbId) =>
  dbConnection.query(getAllVisitsQuery, [cbId]).then(res => res.rows);

module.exports = getAllVisits;
