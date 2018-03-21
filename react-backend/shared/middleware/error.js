/*
 * Common middleware
 *
 * To be mounted on the root app
 */

// catch 404 and forward to error handler
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// error handler
exports.errorHandler = (err, req, res) => {
  if (err === 'notauthorized') {
    return res.status(401).send({ error: 'Not logged in' });
  }
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error, message });
};
