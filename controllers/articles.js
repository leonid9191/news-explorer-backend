const NewsCard = require("../models/article");
const InternalServerError = require("../utils/InternalError");
const Unathorized = require("../utils/Unathorized");
const NotFoundError = require("../utils/NotFoundError");
const ForbiddenError = require("../utils/ForbiddenError");
// const currentUserId = "64612b47cb37732fe26b196b";

const getSavedArticles = (req, res, next) => {
  console.log("get articels", currentUserId);
  const currentUserId = req.user._id;

  NewsCard.find({})
    .select("+owner")
    .then((articles) => {
      const userArticles = articles.filter(
        (article) => article.owner.toString() === currentUserId
      );
      if (userArticles.length === 0) {
        next(new NotFoundError("You don't have any saved articles"));
      }

      return userArticles;
    })
    .then((articles) => {
      const articlesUpdated = [];

      if (articles.length > 1) {
        articles.forEach((article) => {
          const articleInfo = article.toJSON();
          delete articleInfo.owner;
          articlesUpdated.push(articleInfo);
        });
      } else if (articles.length === 1) {
        const article = articles[0];
        delete article.owner;
        articlesUpdated.push(article);
      }

      res.send(articlesUpdated);
    })
    .catch(() => {
      next(new InternalServerError("An error has occurred with the server"));
    });
};

const saveArticle = (req, res, next) => {
  // const owner = currentUserId;
  const owner = req.user._id;

  const { keyword, title, text, date, link, source, image } = req.body;

  NewsCard.create({
    keyword,
    title,
    text,
    date,
    link,
    source,
    image,
    owner,
  })
    .then((article) => {
      if (!owner) {
        next(
          new Unathorized("You need to sign up or sign in to save articles")
          );
        }

        return article;
      })
      .then((article) => {
        const articleInfo = article.toJSON();
        delete articleInfo.owner;

        res.status(200).send({ data: articleInfo });
    })
    .catch((err) => {
      if (err.status === 404) {
        next(new NotFoundError("Article not found"));
      } else {
        next(new InternalServerError("An error has occurred with the server"));
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const currentUserId = req.user._id;

  NewsCard.findById(articleId)
    .select("owner")
    .orFail(new NotFoundError("Data not found"))
    .then((article) => {
      if (!articleId) {
        next(NotFoundError("Data not found"));
      }
      if (article.owner.toString() !== currentUserId) {
        next(new ForbiddenError("Cannot delete another user's card"));
      }
      return article;
    })
    .then(() => {
      NewsCard.findOneAndDelete(articleId)
        .orFail(new NotFoundError("Data not found"))
        .then(() =>
          res
            .status(SUCCESS_MSG)
            .send({ data: articleId, message: "Article deleted" })
        )
        .catch(next);
    })
    .catch((err) => {
        next(new NotFoundError("Data not found"));
    });
};

module.exports = {
  getSavedArticles,
  saveArticle,
  deleteArticle,
};
