'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12, (hashErr, hashed_password) => {
    if (hashErr) {
      return next(hashErr);
    }

    console.log(req.body.email, hashed_password);
    res.sendStatus(200);
  });
});

module.exports = router;
