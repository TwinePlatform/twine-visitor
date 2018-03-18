const putNewUserDetailsQuery = `
  UPDATE users
  SET fullname = $3, sex = $4, yearofbirth = $5, email = $6, phone_number = $7, is_email_contact_consent_granted = $8, is_sms_contact_consent_granted = $9
  WHERE id = $2 AND cb_id = $1
  RETURNING  id, cb_id, fullname, sex, yearofbirth, email, phone_number AS phone, date, hash, is_email_contact_consent_granted AS emailcontact, is_sms_contact_consent_granted AS smscontact`;

const putNewUserDetails = (dbConnection, cbId, userId, fullName, sex, yearOfBirth, email, phone, is_email_contact_consent_granted, is_sms_contact_consent_granted) =>
  dbConnection
    .query(putNewUserDetailsQuery, [
      cbId,
      userId,
      fullName,
      sex,
      yearOfBirth,
      email,
      phone,
      is_email_contact_consent_granted,
      is_sms_contact_consent_granted,
    ])
    .then(
      res =>
        res.rowCount ? res.rows[0] : Promise.reject(new Error('No user found'))
    );

module.exports = putNewUserDetails;
