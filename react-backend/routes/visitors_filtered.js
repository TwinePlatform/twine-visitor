const router = require('express').Router();
const visitorsFiltered = require('../database/queries/visitors_filtered');

router.post('/', (req, res, next) => {
  visitorsFiltered(req.auth.cb_id, {
    filterBy: req.body.filterBy,
    orderBy: req.body.orderBy,
  })
    .then(users => res.send({ users }))
    .catch(next);
});

module.exports = router;
