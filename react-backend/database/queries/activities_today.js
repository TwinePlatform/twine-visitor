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
    sunday: query('sunday'),
  }[day];

  return new Promise((resolve, reject) => {
    if (!dayQuery || !cbId) return reject(new Error('Incorrect arguments'));

    dbConnection
      .query(dayQuery, [cbId])
      .then(res => resolve(res.rows))
      .catch(reject);
  });
};

module.exports = activitiesForToday;
