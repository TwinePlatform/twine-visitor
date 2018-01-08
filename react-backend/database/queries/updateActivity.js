const dbConnection = require('../dbConnection');

const updateActivityQuery =
  'UPDATE activities SET monday = $2, tuesday = $3, wednesday=$4, thursday=$5, friday=$6, saturday=$7, sunday=$8 WHERE id = $1 AND cb_id = $9';

const updateActivity = (
  id,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
  cb_id,
  cb,
) => {
  dbConnection.query(
    updateActivityQuery,
    [id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, cb_id],
    (err, res) => {
      if (err) {
        return cb(err);
      }

      cb(null, res);
    },
  );
};

module.exports = updateActivity;
