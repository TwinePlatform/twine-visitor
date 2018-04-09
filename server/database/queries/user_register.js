const insertUser = `
  INSERT INTO users (cb_id, fullName, sex, phone_number, yearOfBirth, email, hash, is_email_contact_consent_granted, is_sms_contact_consent_granted)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

const putUserData = (
  dbConnection,
  cb_id,
  fullname,
  sex,
  phone,
  yob,
  email,
  hashString,
  is_email_contact_consent_granted,
  is_sms_contact_consent_granted,
) =>
  dbConnection.query(insertUser, [
    cb_id,
    fullname,
    sex,
    phone,
    yob,
    email,
    hashString,
    is_email_contact_consent_granted,
    is_sms_contact_consent_granted,
  ]);

module.exports = putUserData;
