const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { testLink } = require("../utils/testLink");

const {
  getSavedArticles,
  saveArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get('/', getSavedArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(testLink),
    image: Joi.string().custom(testLink),
  }),
}), saveArticle);

router.delete('/:id', celebrate({

  params: Joi.object().keys({
    id: Joi.string().required().alphanum().length(24)
      .hex(),
  }),
}), deleteArticle);

module.exports = router;