const getUserDetailsQuery = `
  SELECT id, cb_id, fullname, sex, yearofbirth, email, phone_number AS phone, date, hash, is_email_contact_consent_granted AS emailcontact, is_sms_contact_consent_granted AS smscontact
  FROM users
  WHERE cb_id = $1 AND id = $2`;

const getUserDetails = (dbConnection, cbId, userId) =>
  dbConnection.query(getUserDetailsQuery, [cbId, userId]).then(res => res.rows);

module.exports = getUserDetails;
