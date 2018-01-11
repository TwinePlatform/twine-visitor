const validator = require('validator');

const express = require('express');
const jwt = require('jsonwebtoken');

const hashCB = require('../../functions/cbhash');

const router = express.Router();
const getCBlogindetailsvalid = require('../../database/queries/getCBlogindetailsvalid');
const { checkHasLength } = require('../../functions/helpers');

router.post('/', (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    const isEmail = validator.isEmail(data.formEmail);
    const hasInput = checkHasLength([data.formEmail, data.formPswd]);

    if (isEmail && hasInput) {
      const passwordHash = hashCB(data.formPswd);

      getCBlogindetailsvalid(data.formEmail, passwordHash)
        .then(exists => {
          const token = jwt.sign({ email: data.formEmail }, process.env.SECRET);
          const loggedIn = exists
            ? { success: true, token }
            : { success: false };

          res.send(loggedIn);
        })
        .catch(next);
    } else if (!isEmail || !hasInput) {
      const reason = (!isEmail && 'email') || (!hasInput && 'noinput');
      res.send({ reason });
    } else {
      next(new Error('Unkown error in visitor check'));
    }
  });
});

module.exports = router;
