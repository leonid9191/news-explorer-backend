const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const BadReqError = require('../utils/BadReqError');
const ConflictError = require('../utils/ConflictError');

const getUser = (req, res, next) => {
  // const id = '64612c0d5016516426460b1c';
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User ID not found'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  getUser(req, res, next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Email already in system');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const userInfo = user.toJSON();
      delete userInfo.password;
      res.status(200).send({ data: userInfo });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Incorrect email or password'));
      } else {
        next(err);
      }
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'test',
        {
          expiresIn: '7d',
        },
      );
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new BadReqError('Incorrect email or password'));
    });
};

module.exports = {
  getUser,
  getCurrentUser,
  createUser,
  userLogin,
};
