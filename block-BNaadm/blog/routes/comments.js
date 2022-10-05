const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Article = require("../models/Article");

//comment likes
router.get("/:commentId/like", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: 1 } },
    (err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId);
    }
  );
});

//comment dislikes
router.get("/:commentId/dislike", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: -1 } },
    (err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId);
    }
  );
});

//comment edit
router.get("/:commentId/edit", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.render("editComment", { comment });
  });
});

//comment edit and post
router.post("/:commentId", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect("/articles/" + updatedComment.articleId);
  });
});

//comment delete
router.get("/:commentId/delete", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      deletedComment.articleId,
      { $pull: { comments: deletedComment._id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + deletedComment.articleId);
      }
    );
  });
});

module.exports = router;
