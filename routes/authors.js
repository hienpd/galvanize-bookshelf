'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

// GET /authors
router.get('/authors', (_req, res, next) => {
  knex('authors')
    .orderBy('id')
    .then((authors) => {
      res.send(authors);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /authors/3
router.get('/authors/:id', (req, res, next) => {
  knex('authors')
  .where('id', req.params.id)
  .first()
  .then((author) => {
    res.send(author);
  })
  .catch((err) => {
    next(err);
  });
});

// POST /authors
router.post('/authors', (req, res, next) => {
  knex('authors')
    .insert(req.body, '*')
    .then((authors) => {
      res.send(authors[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// PATCH /authors/3
router.patch('/authors/:id', (req, res, next) => {
  knex('authors')
    .update(req.body, '*')
    .where('id', req.params.id)
    .then((authors) => {
      res.send(authors[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE /authors/3
router.delete('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((author) => {

      return knex('authors')
      .del()
      .where('id', req.params.id)
      .then(() => {
        delete author.id;
        res.send(author);
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /authors/3/books
router.get('/authors/:id/books', (req, res, next) => {
  knex('books')
    .where('author_id', req.params.id)
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
