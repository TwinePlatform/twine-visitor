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
    if (!dayQuery) return reject(new Error('Incorrect day supplied to query'));

    dbConnection.query(dayQuery, [cbId], (err, res) => {
      if (err) return reject(err);

      resolve(res.rows);
    });
  });
};

module.exports = activitiesForToday;
