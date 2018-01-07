const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const insertActivity = require('../database/queries/insertActivity');

router.post('/', (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ error: 'Not logged in' }));
    } else {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const activityToAdd = JSON.parse(body);
        console.log(
          'im on the way to the database: ',
          'id: ',
          activityToAdd.id,
          'name: ',
          activityToAdd.name,
        );
        insertActivity(activityToAdd.id, activityToAdd.name, (error, result) => {
          if (error) {
            console.log('I am an error from insertActivity ', error);
            res.status(500).send(error);
          } else {
            res.send('success');
          }
        });
      });
    }
  });
});

module.exports = router;
