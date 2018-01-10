const express = require("express");

const router = express.Router();

const putVisitsData = require("../database/queries/putVisitsData");

router.post("/", (req, res, next) => {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const visitToAdd = JSON.parse(body);
    console.log(visitToAdd);
    putVisitsData(visitToAdd.hash, visitToAdd.activity)
      .then(result => {
        res.send("success");
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      });
  });
});

module.exports = router;
