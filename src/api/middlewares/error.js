const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const APIError = require('../errors/api-error');
const { env } = require('../../config/vars');

/**
 * Handles a given error.
 * @param {Object} err Error instance.
 * @param {Object} req Request instance.
 * @param {Object} res Response instance.
 * @param {Object} res Next instance.
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * Convert a given error to APIError instance.
 * @param {Object} err Error instance.
 * @param {Object} req Request instance.
 * @param {Object} res Response instance.
 * @param {Object} res Next instance.
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof ValidationError) {
    convertedError = new APIError({
      message: 'Validation error',
      errors: err.details,
      status: err.status,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Handles request with a not found error if needed.
 * @param {Object} req Request instance.
 * @param {Object} res Response instance.
 * @param {Object} res Next instance.
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
