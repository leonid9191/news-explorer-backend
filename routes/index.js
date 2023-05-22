const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');

const NotFoundError = require('../utils/NotFoundError');

const articlesRouter = require('./articles');
const usersRouter = require('./users');

const { createUser, userLogin } = require('../controllers/users');

const router = express.Router();

router.post('/signup', celebrate({
  body: {
    name: Joi.string().required().min(2).max(10),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), createUser);
router.post('/signin', userLogin);

// router.use(auth);

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
