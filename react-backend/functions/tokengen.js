const crypto = require('crypto');

crypto.randomBytes(64, (err, buf) => {
  if (err) throw err;
  const token = buf.toString('hex');
  console.log(`${buf.length} bytes of random data: ${token}`);
  return token;
});
