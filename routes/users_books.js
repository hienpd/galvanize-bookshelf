'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    console.log('You are not allowed!');
    return res.sendStatus(401);
  }

  next();
}

// GET /users/books
router.get('/users/books', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where('users_books.user_id', userId)
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /users/books/1
router.get('/users/books/:bookId', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.bookId);

  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where({
      'books.id': bookId,
      'users_books.user_id': userId
    })
    .first()
    .then((book) => {
      if (!book) {
        return res.sendStatus(404);
      }

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

// POST /users/book/2
router.post('/users/books/:bookId', checkAuth, (req, res, next) => {
  const bookId = Number.parseInt(req.params.bookId);
  const userId = req.session.userId;

  knex('users_books')
    .insert({
      user_id: userId,
      book_id: bookId
    }, '*')
    .then((results) => {
      console.log(userId, bookId);
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE /users/books/2
router.delete('/users/books/:bookId', checkAuth, (req, res, next) => {
  const bookId = Number.parseInt(req.params.bookId);
  const userId = req.session.userId;

  knex('users_books')
    .where({
      user_id: userId,
      book_id: bookId
    })
    .first()
    .then((user_book) => {

      return knex('users_books')
      .del()
      .where({
        user_id: userId,
        book_id: bookId
      })
      .then(() => {
        delete user_book.id;
        res.send(user_book);
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
