/* eslint-disable import/extensions */
const SendResponses = require('../utils/sendResponses');
const BaseError = require('./BaseError');

const { sendErrorResponse } = SendResponses;

/**
 * @class
 */
class ErrorHandler {
  /**
   *
   * @param {Error} err
   * @param {Response} res
   */
  static async handleError(err, res) {
    if (err instanceof BaseError) {
      await sendErrorResponse(res, err.httpCode, err.message);
    }
  }

  /**
   *
   * @param {Error} error
   * @returns Boolean
   */
  static isTrustedError(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

module.exports = ErrorHandler;
