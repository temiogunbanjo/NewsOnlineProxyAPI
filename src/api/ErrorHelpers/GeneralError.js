/* eslint-disable import/extensions */
const BaseError = require('./BaseError');

/**
 * @class
 */
class GeneralError extends BaseError {
  /**
   *
   * @param {string} name
   * @param {number} httpCode
   * @param {boolean} isOperational
   * @param {string} description
   */
  constructor(name,
    httpCode,
    isOperational,
    description = 'An error occured') {
    super(name, httpCode, isOperational, description);
  }
}

module.exports = GeneralError;
