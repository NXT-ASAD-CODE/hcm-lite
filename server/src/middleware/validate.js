const ApiError = require('../utils/ApiError');

// Usage: validate({ body: schema, params: schema, query: schema })
const validate = (schemas) => (req, res, next) => {
  req.validated = req.validated || {};
  for (const key of ['params', 'query', 'body']) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data', details));
    }
    if (key === 'body') req.body = result.data;
    else req.validated[key] = result.data;
  }
  next();
};

module.exports = validate;