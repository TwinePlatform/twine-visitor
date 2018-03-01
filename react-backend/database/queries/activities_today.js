const dbConnection = require('../dbConnection');

const query = day => `SELECT id, name FROM activities
                      WHERE ${day}=true AND deleted=false AND cb_id=$1`;

const activitiesForToday = (cbId, day) => {
  const dayQuery = {
    monday: query('monday'),
    tuesday: query('tuesday'),
    wednesday: query('wednesday'),
    thursday: query('thursday'),
    friday: query('friday'),
    saturday: query('saturday'),
    sunday: query('sunday')
  }[day];

  if (!dayQuery || !cbId)
    return Promise.reject(new Error('Incorrect arguments'));

  return dbConnection
    .query(dayQuery, [cbId])
    .then(res => res.rows)
};

module.exports = activitiesForToday;
