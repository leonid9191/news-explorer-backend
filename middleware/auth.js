const jwt = require('jsonwebtoken');
const Unathorized = require('../utils/Unathorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unathorized('Auth Required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'test',
    );
  } catch (err) {
    return next(new Unathorized('Auth Required'));
  }
  req.user = payload;

  return next();
};
