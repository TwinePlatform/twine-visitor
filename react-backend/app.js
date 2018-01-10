const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const qrgenerator = require('./routes/qrgenerator');
const getUsername = require('./routes/getUsername');
const getAllUsers = require('./routes/getAllUsers');
const isAdminAuthenticated = require('./routes/isAdminAuthenticated');
const checkUser = require('./routes/checkUser');
const postActivity = require('./routes/postActivity');
const activitiesAll = require('./routes/activities_all');
const activitiesToday = require('./routes/activities_today');
const activitiesAdd = require('./routes/activities_add');
const activitiesUpdate = require('./routes/activities_update');
const activitiesDelete = require('./routes/activities_delete');
const checkCB = require('./routes/cbauthentication/checkCB');
const registerCB = require('./routes/cbauthentication/registerCB');
const checkCBlogin = require('./routes/cbauthentication/checkCBlogin');
const checkPassword = require('./routes/cbauthentication/checkPassword');
const CBPasswordResetInstigator = require('./routes/cbauthentication/CBPasswordResetInstigator');
const isAuthenticated = require('./routes/cbauthentication/isAuthenticated');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/qrgenerator', isAuthenticated, qrgenerator);
app.use('/getUsername', isAuthenticated, getUsername);
app.use('/all-users', isAuthenticated, getAllUsers);
app.use('/isAdminAuthenticated', isAuthenticated, isAdminAuthenticated);
app.use('/checkUser', isAuthenticated, checkUser);
app.use('/postActivity', isAuthenticated, postActivity);
app.use('/activities', isAuthenticated, activitiesAll);
app.use('/activitiesForToday', isAuthenticated, activitiesToday);
app.use('/addActivity', isAuthenticated, activitiesAdd);
app.use('/updateActivityDay', isAuthenticated, activitiesUpdate);
app.use('/removeActivity', isAuthenticated, activitiesDelete);
app.use('/checkCB', checkCB);
app.use('/registerCB', registerCB);
app.use('/checkCBlogin', checkCBlogin);
app.use('/checkPassword', checkPassword);
app.use('/CBPasswordResetInstigator', CBPasswordResetInstigator);

app.get('/*', express.static(path.join(__dirname, 'client/build/index.html')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err === 'notauthorized') {
    return res.status(401).send({ error: 'Not logged in' });
  }
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
