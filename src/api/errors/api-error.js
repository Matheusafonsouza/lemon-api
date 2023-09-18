const httpStatus = require('http-status');
const ExtendableError = require('./extandable-error');

class APIError extends ExtendableError {
  /**
   * Class constructor.
   * @param {string} message The error message.
   * @param {Array} errors The errors list.
   * @param {string} stack Stack of the error.
   * @param {number} status Error status code.
   * @param {boolean} isPublic Value to inform if error is public.
   */
  constructor({ message, errors, stack, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }) {
    super({
      message,
      errors,
      status,
      isPublic,
      stack,
    });
  }
}

module.exports = APIError;
