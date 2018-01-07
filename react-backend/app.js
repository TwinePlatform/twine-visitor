const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const index = require('./routes/index');
const qrgenerator = require('./routes/qrgenerator');
const getUsername = require('./routes/getUsername');
const getAllUsers = require('./routes/getAllUsers');
const isAdminAuthenticated = require('./routes/isAdminAuthenticated');
const checkUser = require('./routes/checkUser');
const postActivity = require('./routes/postActivity');
const activities = require('./routes/activities');
const addActivity = require('./routes/addActivity');
const removeActivity = require('./routes/removeActivity');
const checkCB = require('./routes/cbauthentication/checkCB');
const registerCB = require('./routes/cbauthentication/registerCB');
const checkCBlogin = require('./routes/cbauthentication/checkCBlogin');
const checkPassword = require('./routes/cbauthentication/checkPassword');
const CBPasswordResetInstigator = require('./routes/cbauthentication/CBPasswordResetInstigator');
const getCBFromEmail = require('./database/queries/CBqueries/getCBFromEmail');
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

const isAuthenticated = (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      return next('notauthorized');
    }
    // below we create a req.auth object: if it existed before we leave it as it is, if it didn't exist we assign empty object to req.auth. req.auth will help us to access info related to a cb
    req.auth = req.auth || {};
    req.auth.cb_email = payload.email;
    // Get the community business from the database
    getCBFromEmail(payload.email, (err, res) => {
      if (err) {
        console.log(err);
        return next('notauthorized');
      }
      req.auth.cb_id = res[0].id;
      req.auth.cb_name = res[0].org_name;
      next();
    });
  });
};

app.use('/qrgenerator', isAuthenticated, qrgenerator);
app.use('/getUsername', isAuthenticated, getUsername);
app.use('/all-users', isAuthenticated, getAllUsers);
app.use('/isAdminAuthenticated', isAuthenticated, isAdminAuthenticated);
app.use('/checkUser', isAuthenticated, checkUser);
app.use('/postActivity', isAuthenticated, postActivity);
app.use('/activities', isAuthenticated, activities);
app.use('/addActivity', isAuthenticated, addActivity);
app.use('/removeActivity', isAuthenticated, removeActivity);
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
  if (err === 'notauthorized') {
    return res.send(JSON.stringify({ error: 'Not logged in' }));
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
