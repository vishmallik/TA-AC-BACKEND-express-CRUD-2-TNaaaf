const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

/* GET users listing. */
router.get("/", function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articles", { articles });
  });
});

router.get("/:id/inc", (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

router.get("/:id/dec", (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

router.get("/:id/edit", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("editArticle", { article });
  });
});

router.post("/new", (req, res, next) => {
  req.body.tags = req.body.tags
    .trim()
    .split(",")
    .reduce((acc, tag) => {
      if (tag) {
        acc.push(tag.trim());
      }
      return acc;
    }, []);
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

router.post("/:id", (req, res, next) => {
  req.body.tags = req.body.tags
    .trim()
    .split(",")
    .reduce((acc, tag) => {
      if (tag) {
        acc.push(tag.trim());
      }
      return acc;
    }, []);
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("singleArticle", { article });
  });
});

module.exports = router;
