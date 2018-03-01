const router = require('express').Router();
const userDetails = require('../database/queries/user_details');

router.post('/', (req, res, next) => {
  userDetails(req.app.get('client:psql'), req.auth.cb_id, req.body.userId)
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
