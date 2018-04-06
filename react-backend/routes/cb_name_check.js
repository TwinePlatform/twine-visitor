const router = require('express').Router();

router.get('/', (req, res) => {
  const cbOrgName = req.auth.cb_name;
  const cbLogoUrl = req.auth.cb_logo;

  return res.send({ result: {cbOrgName, cbLogoUrl} });
});

module.exports = router;
