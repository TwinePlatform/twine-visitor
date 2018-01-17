const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const qrSend = require('./routes/qr_user_send');
const qrGenerator = require('./routes/qr_generator');
const qrUserGen = require('./routes/qr_user_gen');
const userDetails = require('./routes/user_details');
const newUserDetails = require('./routes/new_user_details');
const usersAll = require('./routes/users_all');
const visitorsAll = require('./routes/visitors_all');
const usersFiltered = require('./routes/users_filtered');
const visitorsFiltered = require('./routes/visitors_filtered');
const adminAuthenticated = require('./routes/admin_authenticated');
const visitorName = require('./routes/visitor_name');
const visitorCheck = require('./routes/visitor_check');
const visitorActivity = require('./routes/visitor_activity');
const activitiesAll = require('./routes/activities_all');
const activitiesToday = require('./routes/activities_today');
const activitiesAdd = require('./routes/activities_add');
const activitiesUpdate = require('./routes/activities_update');
const activitiesDelete = require('./routes/activities_delete');
const cbRegisterCheck = require('./routes/cbauthentication/cb_register_check');
const cbRegister = require('./routes/cbauthentication/cb_register');
const cbLogin = require('./routes/cbauthentication/cb_login');
const cbPasswordChange = require('./routes/cbauthentication/cb_password_change');
const cbPasswordReset = require('./routes/cbauthentication/cb_password_reset');
const isAuthenticated = require('./routes/cbauthentication/isAuthenticated');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/qr-send', isAuthenticated, qrSend);
app.use('/qrgenerator', isAuthenticated, qrGenerator);
app.use('/qr-user-gen', isAuthenticated, qrUserGen);
app.use('/getUsername', isAuthenticated, visitorName);
app.use('/user-details', isAuthenticated, userDetails);
app.use('/users-all', isAuthenticated, usersAll);
app.use('/all-users', isAuthenticated, visitorsAll);
app.use('/fetchNewUserDetails', isAuthenticated, newUserDetails);
app.use('/fetchUsersFilteredBy', isAuthenticated, usersFiltered);
app.use('/fetchVisitsFilteredBy', isAuthenticated, visitorsFiltered);
app.use('/isAdminAuthenticated', isAuthenticated, adminAuthenticated);
app.use('/checkUser', isAuthenticated, visitorCheck);
app.use('/postActivity', isAuthenticated, visitorActivity);
app.use('/activities', isAuthenticated, activitiesAll);
app.use('/activitiesForToday', isAuthenticated, activitiesToday);
app.use('/addActivity', isAuthenticated, activitiesAdd);
app.use('/updateActivityDay', isAuthenticated, activitiesUpdate);
app.use('/removeActivity', isAuthenticated, activitiesDelete);
app.use('/checkCB', cbRegisterCheck);
app.use('/registerCB', cbRegister);
app.use('/checkCBlogin', cbLogin);
app.use('/checkPassword', cbPasswordChange);
app.use('/CBPasswordResetInstigator', cbPasswordReset);

app.get('/*', express.static(path.join(__dirname, 'client/build/index.html')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
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
