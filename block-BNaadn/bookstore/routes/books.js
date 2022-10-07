const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const lodash = require("lodash");

//create book
router.get("/new", (req, res, next) => {
  res.render("bookform");
});

//post a new book into database
router.post("/", (req, res, next) => {
  req.body.category = req.body.category
    .trim()
    .split(",")
    .reduce((acc, tag) => {
      if (tag) {
        acc.push(tag.trim());
      }
      return acc;
    }, []);
  Book.create(req.body, (err, book) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

//display all books
router.get("/", (req, res, next) => {
  Book.find({}, (err, bookList) => {
    res.render("bookList", { bookList });
  });
});
//book by author
router.get("/author/:author_name", (req, res, next) => {
  let author_name = req.params.author_name;
  console.log(author_name);
  Book.find({ "author.name": author_name }, (err, bookList) => {
    if (err) return next(err);
    res.render("bookList", { bookList });
  });
});

//author list
router.get("/author", (req, res, next) => {
  Book.find({})
    .sort({ author: 1 })
    .exec((err, bookList) => {
      if (err) return next(err);
      let authorArr = [];
      bookList.forEach((book) => {
        authorArr.push(book.author.name);
      });
      res.render("authorList", { author: lodash.uniq(authorArr) });
    });
});

//book by category
router.get("/category/:category_name", (req, res, next) => {
  let category_name = req.params.category_name;
  Book.find({ category: category_name }, (err, bookList) => {
    if (err) return next(err);
    res.render("bookList", { bookList });
  });
});

router.get("/category", (req, res, next) => {
  Book.find({})
    .sort({ category: 1 })
    .exec((err, bookList) => {
      if (err) return next(err);
      let categoryArr = [];
      bookList.forEach((book) => {
        book.category.forEach((category) => {
          categoryArr.push(category);
        });
      });
      res.render("categoryList", { category: lodash.uniq(categoryArr) });
    });
});

router.get("/:bookId", (req, res, next) => {
  let bookId = req.params.bookId;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.render("singleBook", { book });
  });
});
module.exports = router;
