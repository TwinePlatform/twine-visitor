const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const qrgen = require('./routes/qrgenerator');
const getUsername = require('./routes/getUsername');
const getAllUsers = require('./routes/getAllUsers');
const checkUser = require('./routes/userchecker');
const postActivity = require('./routes/postActivity');
const activities = require('./routes/activities');
const checkCB = require('./routes/cbauthentication/checkCB');
const registerCB = require('./routes/cbauthentication/registerCB');
const checkCBlogin = require('./routes/cbauthentication/checkCBlogin');
const checkCBemail = require('./routes/cbauthentication/CBPasswordResetInstigator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', index);
app.use('/users', users);
app.use('/qrgen', qrgen);
app.use('/getUsername', getUsername);
app.use('/all-users', getAllUsers);
app.use('/checkUser', checkUser);
app.use('/postActivity', postActivity);
app.use('/activities', activities);
app.use('/checkCB', checkCB);
app.use('/registerCB', registerCB);
app.use('/checkCBlogin', checkCBlogin);
app.use('/CBPasswordResetInstigator', checkCBemail);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;
