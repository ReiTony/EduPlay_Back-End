const CustomAPIError = require('./custom_error');
const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./not_found');
const BadRequestError = require('./bad_request');
const UnauthorizedError = require('./unauthorized');
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
