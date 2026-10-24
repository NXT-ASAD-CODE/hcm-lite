// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let code = err.code;
  let message = err.message;

  if (err.code === 11000) {
    status = 409;
    code = 'DUPLICATE';
    message = 'A record with this value already exists';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    code = 'BAD_JSON';
    message = 'Request body is not valid JSON';
  }

  if (status >= 500) {
    console.error(err);
    code = 'INTERNAL_ERROR';
    message = 'Something went wrong';
  }

  res.status(status).json({
    error: { code: code || 'ERROR', message, details: err.details },
  });
}

module.exports = errorHandler;