const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

// validate a url link
const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const {
  getAllArticles,
  saveArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get("/", getAllArticles);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      owner: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string()
        .required()
        .messages({ "string.required": "Source is invalid" }),
      image: Joi.string()
        .custom(validateUrl)
        .messages({ "string.required": "Invalid URL for article image link" }),
      link: Joi.string().required().custom(validateUrl).messages({
        "string.empty": "Link is required",
        "string.uri": "Invalid URL for card link",
      }),
    }),
  }),
  saveArticle
);

router.delete(
  "/:articleId",
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().required().alphanum().length(24).hex(),
    }),
  }),
  deleteArticle
);

module.exports = router;
