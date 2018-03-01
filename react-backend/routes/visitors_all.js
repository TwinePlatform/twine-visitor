const router = require('express').Router();
const visitorsAll = require('../database/queries/visitors_all');

router.post('/', (req, res, next) => {
  visitorsAll(req.app.get('client:psql'), req.auth.cb_id)
    .then(users => res.send({ users }))
    .catch(next);
});

module.exports = router;
