const router = require('express').Router();
const putNewCBDetails = require('../database/queries/putNewCBDetails');

router.post('/', (req, res, next) => {
  putNewCBDetails(
    req.auth.cb_id,
    req.body.org_name,
    req.body.genre,
    req.body.email,
    req.body.uploadedFileCloudinaryUrl
  )
    .then(details => res.send({ token: req.auth.adminToken, details }))
    .catch(next);
});

module.exports = router;
