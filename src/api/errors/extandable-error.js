class ExtendableError extends Error {
  /**
   * Class constructor.
   * @param {string} message The error message.
   * @param {Array} errors The errors list.
   * @param {number} status Error status code.
   * @param {boolean} isPublic Value to inform if error is public.
   * @param {string} stack Stack of the error.
   */
  constructor({ message, errors, status, isPublic, stack }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

module.exports = ExtendableError;
