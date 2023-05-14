const { UNIQUE_EMAIL } = require('./httpStatusCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNIQUE_EMAIL;
  }
}

module.exports = ConflictError;
