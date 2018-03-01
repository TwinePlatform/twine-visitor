const router = require('express').Router();
const visitInsert = require('../database/queries/visit_insert');

router.post('/', (req, res, next) => {
  const { hash, activity } = req.body;
  const pgClient = req.app.get('client:psql');

  if (!hash || !activity) return next(new Error('Error registering visit'));

  visitInsert(pgClient, hash, activity, req.auth.cb_id)
    .then(() => res.send('success'))
    .catch(next);
});

module.exports = router;
