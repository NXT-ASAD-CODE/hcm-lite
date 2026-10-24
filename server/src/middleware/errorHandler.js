// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: {
      code: err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR'),
      message: status === 500 ? 'Something went wrong' : err.message,
    },
  });
}

module.exports = errorHandler;