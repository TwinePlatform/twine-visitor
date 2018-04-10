/*
 * Simple crypto utilities
 */
const crypto = require('crypto');
const bcrypt = require('bcrypt');


/**
 * Signs the payload using the provided secret
 *
 * NOTE: DO NOT USE FOR PASSWORDS, INSECURE
 *
 * @param   {String} secret  Secret to use when signing
 * @param   {String} payload Payload to sign
 * @returns {String}         Resolves with signed payload
 */
const hmac = (secret, payload) =>
  crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');


/**
 * Hashes and salts payload using bCrypt
 *
 * NOTE: Use this for hashing passwords/secrets before storage
 *
 * @param   {String}  payload         Payload to hash
 * @param   {Number}  [saltRounds=10] Number of rounds used to generate salt
 * @returns {Promise}                 Resolves with hashed payload
 */
const saltedHash = (payload, saltRounds = 10) =>
  bcrypt
    .hash(payload, saltRounds);


module.exports = {
  hmac,
  saltedHash,
};
