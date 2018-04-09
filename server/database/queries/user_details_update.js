const { updateQuery } = require('../../shared/models/query_builder');


const putNewUserDetails = async (dbConnection, cbId, userId, data) => {
  const query =
    updateQuery(
      'users',
      data,
      { id: userId, cb_id: cbId },
      'id, cb_id, fullname AS name, sex AS gender, yearofbirth AS yob, email, phone_number, date AS registered_at, hash, is_email_contact_consent_granted AS email_contact, is_sms_contact_consent_granted AS sms_contact'
    );

  const res = await dbConnection.query(query);

  return res.rows[0] || null;
};

module.exports = putNewUserDetails;
