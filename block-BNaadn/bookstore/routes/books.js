var express = require('express');
const { route } = require('.');
let router = express.Router();
const Book = require('../models/book');

//create book
router.get('/new', (req, res, next) => {
  res.render('bookform');
});

//post a new book into database
router.post('/', (req, res, next) => {
  Book.create(req.body, (err, book) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

//display all books
router.get('/', (req, res, next) => {
  Book.find({}, (err, bookList) => {
    res.render('bookList', { bookList });
  });
});

router.get('/:bookId', (req, res, next) => {
  let bookId = req.params.bookId;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.render('singleBook', { book });
  });
});

//order by author name
router.get('/author', (req, res, next) => {
  Book.find({})
    .sort({ author: 1 })
    .exec((err, book) => {
      if (err) return next(err);
      res.render('Authorlist');
    });
});
module.exports = router;
