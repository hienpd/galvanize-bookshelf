'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    return res.sendStatus(401);
  }

  next();
}

router.get('/users/books', checkAuth, (req, res, next) => {
  knex('books')
    .innerJoin('users_books', 'users.books.book_id', 'books.id')
    .where('users_books.user_id', req.session.userId)
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users/books/:bookId', checkAuth, (req, res, next) => {
  const userId = req.session.user.id;
  const bookId = Number.parseInt(req.params.bookId);

  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where({
      'books.id': bookId,
      'users_books.user_id': userId;
      // Fill in
    });
});

router.post('/users/books/:bookId', checkAuth, (req, res, next) => {
  const bookId = Number.parseInt(req.params.bookId);
  const userId = req.session.user.id;

  knex('users_artists')
    .insert({
      user_id: userId,
      book_id: bookId
    }, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/users/books/:bookId', checkAuth, (req, res, next) => {
  const bookId = Number.parseInt(req.params.bookId)
  // Fill in
});

module.exports = router;
