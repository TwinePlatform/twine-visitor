/*
 * Common middleware
 *
 * To be mounted on the root app
 */
const Boom = require('boom');
const { PRODUCTION } = require('../../../config');

// catch 404 and forward to error handler
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// error handler
exports.errorHandler = (err, req, res, next) => { // eslint-disable-line
  const { env } = req.app.get('cfg');

  if (env !== PRODUCTION) {
    console.error(err);
  }

  if (Boom.isBoom(err)) {
    const { statusCode, message } = err.output.payload;

    return res.status(statusCode).send({ result: null, error: message });
  }

  if (err === 'notauthorized') {
    return res.status(401).send({ error: 'Not logged in' });
  }
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({ error, message });
};
