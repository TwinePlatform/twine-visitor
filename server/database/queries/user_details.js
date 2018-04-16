const { selectQuery } = require('../../shared/models/query_builder');


const getUserDetails = async (dbConnection, options) => {
  const query = selectQuery(
    'users',
    [
      'id',
      'cb_id',
      'fullname AS name',
      'sex AS gender',
      'yearofbirth AS yob',
      'email',
      'phone_number',
      'date AS registered_at',
      'hash',
      'is_email_contact_consent_granted AS email_consent',
      'is_sms_contact_consent_granted AS sms_consent',
    ],
    options 
  );

  const result = await dbConnection.query(query);

  return result.rows[0] || null;
};

module.exports = getUserDetails;
