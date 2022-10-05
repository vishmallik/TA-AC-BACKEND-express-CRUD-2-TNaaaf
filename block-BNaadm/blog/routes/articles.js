const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require("../models/Comment");

/* GET users listing. */
router.get("/", function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articles", { articles });
  });
});

router.get("/:articleId/inc", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findByIdAndUpdate(
    articleId,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + articleId);
    }
  );
});

router.get("/:articleId/dec", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findByIdAndUpdate(
    articleId,
    { $inc: { likes: -1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + articleId);
    }
  );
});

router.get("/:articleId/edit", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findById(articleId, (err, article) => {
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

router.post("/:articleId", (req, res, next) => {
  req.body.tags = req.body.tags
    .trim()
    .split(",")
    .reduce((acc, tag) => {
      if (tag) {
        acc.push(tag.trim());
      }
      return acc;
    }, []);
  let articleId = req.params.articleId;
  Article.findByIdAndUpdate(articleId, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + articleId);
  });
});

router.get("/:articleId/delete", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findByIdAndDelete(articleId, (err, deletedArticle) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: articleId }, (err, info) => {
      res.redirect("/articles");
    });
  });
});

router.get("/:articleId", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findById(articleId)
    .populate("comments")
    .exec((err, article) => {
      if (err) return next(err);
      res.render("singleArticle", { article });
    });
});

router.post("/:articleId/comments", (req, res, next) => {
  let articleId = req.params.articleId;
  req.body.articleId = articleId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: comment._id } },
      (err, updatedArticle) => {
        if (err) next(err);
        res.redirect("/articles/" + articleId);
      }
    );
  });
});

module.exports = router;
