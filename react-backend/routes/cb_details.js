const router = require('express').Router();
const getCBDetails = require('../database/queries/getCBDetails');

router.post('/', (req, res, next) => {
  getCBDetails(req.auth.cb_id)
    .then(details => res.send({ token: req.auth.adminToken, details }))
    .catch(next);
});

module.exports = router;
