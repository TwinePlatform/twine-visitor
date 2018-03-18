const router = require('express').Router();

const cbDetailsNew = require('./routes/cb_details_new');
const cbDetails = require('./routes/cb_details');
const qrSend = require('./routes/qr_user_send');
const qrGenerator = require('./routes/qr_generator');
const qrUserGen = require('./routes/qr_user_gen');
const userDetails = require('./routes/user_details');
const userDetailsNew = require('./routes/user_details_update');
const usersAll = require('./routes/users_all');
const usersChartAll = require('./routes/users_chart_all');
const usersFiltered = require('./routes/users_filtered');
const visitorsAll = require('./routes/visitors_all');
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
const cbRegister = require('./routes/cbauthentication/cb_register');
const cbLogin = require('./routes/cbauthentication/cb_login');
const cbPasswordChange = require('./routes/cbauthentication/cb_password_change');
const cbPasswordReset = require('./routes/cbauthentication/cb_password_reset');
const cbFeedback = require('./shared/controllers/feedback');

const mwIsAuthenticated = require('./routes/cbauthentication/mw_is_authenticated');
const mwAdminIsAuthenticated = require('./routes/cbauthentication/mw_admin_is_authenticated');

// Open routes
router.use('/cb/register', cbRegister);
router.use('/cb/login', cbLogin);
router.use('/cb/pwd/change', cbPasswordChange);
router.use('/cb/pwd/reset', cbPasswordReset);

// Not open but following api plan
router.get('/cb/feedback', mwAdminIsAuthenticated, cbFeedback.get);
router.post('/cb/feedback', mwIsAuthenticated, cbFeedback.post);

// Authenticated routes
router.use('/qr/generator', mwIsAuthenticated, qrGenerator);
router.use('/user/name-from-scan', mwIsAuthenticated, visitorName);
router.use('/visit/check', mwIsAuthenticated, visitorCheck);
router.use('/visit/add', mwIsAuthenticated, visitInsert);
router.use('/activities/today', mwIsAuthenticated, activitiesToday);
router.use('/admin/login', mwIsAuthenticated, adminLogin);

// Admin routes
router.use('/user/qr/email', mwAdminIsAuthenticated, qrSend);
router.use('/user/qr', mwAdminIsAuthenticated, qrUserGen);
router.use('/cb/details', mwAdminIsAuthenticated, cbDetails);
router.use('/cb/details/update', mwAdminIsAuthenticated, cbDetailsNew);
router.use('/user/details', mwAdminIsAuthenticated, userDetails);
router.use('/user/details/update', mwAdminIsAuthenticated, userDetailsNew);
router.use('/users/all', mwAdminIsAuthenticated, usersAll);
router.use('/users/chart-all', mwAdminIsAuthenticated, usersChartAll);
router.use('/users/filtered', mwAdminIsAuthenticated, usersFiltered);
router.use('/visitors/all', mwAdminIsAuthenticated, visitorsAll);
router.use('/visitors/filtered', mwAdminIsAuthenticated, visitorsFiltered);
router.use('/admin/check', mwAdminIsAuthenticated, adminCheck);
router.use('/activities/all', mwAdminIsAuthenticated, activitiesAll);
router.use('/activity/add', mwAdminIsAuthenticated, activitiesAdd);
router.use('/activity/update', mwAdminIsAuthenticated, activitiesUpdate);
router.use('/activity/delete', mwAdminIsAuthenticated, activitiesDelete);

module.exports = router;
