const express = require("express");

const jwt = require("jsonwebtoken");

const router = express.Router();

const getAllUsers = require("../database/queries/getAllUsers");

const hashCB = require("../functions/cbhash");
const getCBLoginDetailsValid = require("../database/queries/getCBlogindetailsvalid");

router.post("/", (req, res, next) => {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const bodyObject = JSON.parse(body);
    jwt.verify(
      req.headers.authorization,
      process.env.SECRET,
      (err, payload) => {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({ success: false, reason: "not logged in" }));
        } else {
          const hashedPassword = hashCB(bodyObject.password);
          getCBLoginDetailsValid(
            payload.email,
            hashedPassword,
            (error, result) => {
              if (error) {
                res.status(500).send(error);
              } else {
                if (result.rows[0].exists) {
                  getAllUsers()
                    .then(users => res.send({ success: true, users }))
                    .catch(err => {
                      console.log(err);
                      res.status(500).send(err);
                    });
                } else {
                  res.send(
                    JSON.stringify({
                      success: false,
                      reason: "incorrect password"
                    })
                  );
                }
              }
            }
          );
        }
      }
    );
  });
});

module.exports = router;
