'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

// GET /books
router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /books/3
router.get('/books/:id', (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((book) => {
    res.send(book);
  })
  .catch((err) => {
    next(err);
  });
});

// POST /books
router.post('/books', (req, res, next) => {
  knex('books')
    .insert(req.body, '*')
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// PATCH /books/3
router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .update(req.body, '*')
    .where('id', req.params.id)
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE /books/3
router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {

      return knex('books')
      .del()
      .where('id', req.params.id)
      .then(() => {
        delete book.id;
        res.send(book);
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
