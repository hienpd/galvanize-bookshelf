'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex');

// Register new user
router.post('/users', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check whether email is blank
  if (!email || email.trim() === '') {
    return res.status(400).set('Content-Type', 'text/plain')
      .send('Email must not be blank');
  }

  // Check whether password is blank
  if (!password || password.trim() === '') {
    return res.status(400).set('Content-Type', 'text/plain')
      .send('Password must not be blank');
  }

  // Check if email already exists
  knex('users').where('email', email)
    .then((users) => {
      if (users.length > 0) {
        return res.status(400).set('Content-Type', 'text/plain').send('Email already exists');
      }

      bcrypt.hash(req.body.password, 12, (hashErr, hashed_password) => {
        if (hashErr) {
          return next(hashErr);
        }

        knex('users')
        .insert({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          hashed_password: hashed_password
        })
        .then((users) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          next(err);
        });
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
