const { UNAUTHORIZED } = require('./httpStatusCodes');

class Unathorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = Unathorized;
