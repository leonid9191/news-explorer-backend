const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const valid = require('validator');

const {
  getAllArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', getAllArticles);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: {
        validator(v) {
          return valid.isURL(v);
        },
      },
      image: {
        validator(v) {
          return valid.isURL(v);
        },
      },
    }),
  }),
  saveArticle,
);

router.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().required().alphanum().length(24)
        .hex(),
    }),
  }),
  deleteArticle,
);

module.exports = router;
