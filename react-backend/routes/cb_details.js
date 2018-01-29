const router = require('express').Router();
const cbDetails = require('../database/queries/cb/cb_details');

router.post('/', (req, res, next) => {
  cbDetails(req.auth.cb_id)
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
