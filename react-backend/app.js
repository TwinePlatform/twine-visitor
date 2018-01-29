const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cbDetailsNew = require('./routes/cb_details_new');
const cbDetails = require('./routes/cb_details');
const qrSend = require('./routes/qr_user_send');
const qrGenerator = require('./routes/qr_generator');
const qrUserGen = require('./routes/qr_user_gen');
const userDetails = require('./routes/user_details');
const userDetailsNew = require('./routes/user_details_update');
const usersAll = require('./routes/users_all');
const visitorsAll = require('./routes/visitors_all');
const usersFiltered = require('./routes/users_filtered');
const visitorsFiltered = require('./routes/visitors_filtered');
const adminLogin = require('./routes/admin_login');
const adminCheck = require('./routes/admin_check');
const visitorName = require('./routes/visitor_name');
const visitorCheck = require('./routes/visitor_check');
const visitInsert = require('./routes/visit_insert');
const activitiesAll = require('./routes/activities_all');
const activitiesToday = require('./routes/activities_today');
const activitiesAdd = require('./routes/activities_add');
const activitiesUpdate = require('./routes/activities_update');
const activitiesDelete = require('./routes/activities_delete');

const genderNumbers = require('./routes/gender_numbers');

const cbRegisterCheck = require('./routes/cbauthentication/cb_register_check');
const cbRegister = require('./routes/cbauthentication/cb_register');
const cbLogin = require('./routes/cbauthentication/cb_login');
const cbPasswordChange = require('./routes/cbauthentication/cb_password_change');
const cbPasswordReset = require('./routes/cbauthentication/cb_password_reset');
const mwIsAuthenticated = require('./routes/cbauthentication/mw_is_authenticated');
const mwAdminIsAuthenticated = require('./routes/cbauthentication/mw_admin_is_authenticated');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// Open routes
app.use('/cb/register', cbRegister);
app.use('/cb/register/check', cbRegisterCheck);
app.use('/cb/login', cbLogin);
app.use('/cb/pwd/change', cbPasswordChange);
app.use('/cb/pwd/reset', cbPasswordReset);

// Authenticated routes
app.use('/qr/generator', mwIsAuthenticated, qrGenerator);
app.use('/user/name-from-scan', mwIsAuthenticated, visitorName);
app.use('/visit/check', mwIsAuthenticated, visitorCheck);
app.use('/visit/add', mwIsAuthenticated, visitInsert);
app.use('/activities/today', mwIsAuthenticated, activitiesToday);
app.use('/admin/login', mwIsAuthenticated, adminLogin);

// Admin routes
app.use('/user/qr/email', mwAdminIsAuthenticated, qrSend);
app.use('/user/qr', mwAdminIsAuthenticated, qrUserGen);
app.use('/cb/details', mwAdminIsAuthenticated, cbDetails);
app.use('/cb/details/update', mwAdminIsAuthenticated, cbDetailsNew);
app.use('/user/details', mwAdminIsAuthenticated, userDetails);
app.use('/user/details/update', mwAdminIsAuthenticated, userDetailsNew);
app.use('/users/all', mwAdminIsAuthenticated, usersAll);
app.use('/users/filtered', mwAdminIsAuthenticated, usersFiltered);
app.use('/visitors/all', mwAdminIsAuthenticated, visitorsAll);
app.use('/visitors/filtered', mwAdminIsAuthenticated, visitorsFiltered);
app.use('/admin/check', mwAdminIsAuthenticated, adminCheck);
app.use('/activities/all', mwAdminIsAuthenticated, activitiesAll);
app.use('/activity/add', mwAdminIsAuthenticated, activitiesAdd);
app.use('/activity/update', mwAdminIsAuthenticated, activitiesUpdate);
app.use('/activity/delete', mwAdminIsAuthenticated, activitiesDelete);

app.use('/getGenderNumbers', mwAdminIsAuthenticated, genderNumbers);

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
