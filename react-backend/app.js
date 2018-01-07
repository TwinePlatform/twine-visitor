const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const qrgenerator = require('./routes/qrgenerator');
const getUsername = require('./routes/getUsername');
const getAllUsers = require('./routes/getAllUsers');
const checkUser = require('./routes/checkUser');
const postActivity = require('./routes/postActivity');
const activities = require('./routes/activities');
const addActivity = require('./routes/addActivity');
const checkCB = require('./routes/cbauthentication/checkCB');
const registerCB = require('./routes/cbauthentication/registerCB');
const checkCBlogin = require('./routes/cbauthentication/checkCBlogin');
const checkPassword = require('./routes/cbauthentication/checkPassword');
const CBPasswordResetInstigator = require('./routes/cbauthentication/CBPasswordResetInstigator');
const frontEndRoutes = require('./frontEndRoutes');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

frontEndRoutes.forEach(route =>
  app.use(route, express.static(path.join(__dirname, 'client/build/index.html'))),
);
app.use('/qrgenerator', qrgenerator);
app.use('/getUsername', getUsername);
app.use('/all-users', getAllUsers);
app.use('/checkUser', checkUser);
app.use('/postActivity', postActivity);
app.use('/activities', activities);
app.use('/addActivity', addActivity);
app.use('/checkCB', checkCB);
app.use('/registerCB', registerCB);
app.use('/checkCBlogin', checkCBlogin);
app.use('/checkPassword', checkPassword);
app.use('/CBPasswordResetInstigator', CBPasswordResetInstigator);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error, message });
});

const port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;
