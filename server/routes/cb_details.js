const router = require('express').Router();
const cbDetails = require('../database/queries/cb/cb_details');

router.post('/', (req, res, next) => {
  cbDetails(req.app.get('client:psql'), req.auth.cb_id)
    .then(details => res.send({ result: details }))
    .catch(next);
});

module.exports = router;
