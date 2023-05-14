const { INTERNAL_SERVER } = require('./httpStatusCodes');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER;
  }
}

module.exports = InternalServerError;
