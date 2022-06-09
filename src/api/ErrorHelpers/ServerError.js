const BaseError = require('./BaseError');
const HttpStatusCode = require('./Statuscode');

/**
 * @class
 */
class ServerError extends BaseError {
  /**
   *
   * @param {string} name
   * @param {number} httpCode
   * @param {boolean} isOperational
   * @param {string} description
   */
  constructor(name,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = false,
    description = 'internal server error') {
    super(name, httpCode, isOperational, description);
  }
}

module.exports = ServerError;
