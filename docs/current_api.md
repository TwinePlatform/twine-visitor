# Current API
| Path | Headers | Request Body | Response Body |
|:----|:----:|:----:|:----:|
| `POST /admin/login` | `Authorization: std_token` | `{ password }` | `{ success: Bool, reason?: String, token?: String }` |
| `POST /admin/check` | `Authorization: cb_admin_token` | | `{ success: Bool }` |
| `POST /cb/register` | | `{ formPswd, formName, formEmail, formGenre, formPswdConfirm }` | `Bool` or `{ result, error?, validation? }` or `{ success: Bool }` |
| `POST /cb/login` | | `{ formEmail, formPswd }` | `{ success?: Bool, reason?: String, token?: String }` |
| `POST /cb/pwd/change` | | `{ formPswd, formPswdConfirm, token }` | `String?` or `Bool` |
| `POST /cb/pwd/reset` | | `{ formEmail }` | `String?` or `Bool` |
| `POST /cb/details` | `Authorization: cb_admin_token` | | `{ results: { id, org_name, genre, email, uploadedFileCloudinaryUrl, date } }` |
| `POST /cb/details/update` | `Authorization: cb_admin_token` | `{ org_name, genre, email, uploadedFileCloudinaryUrl }` | `{ results: { `☝️` } }` |
| `POST /qr/generator` | `Authorization: std_token` | `{ formSender, formPhone, formGender, formYear, formEmail, formEmailContact, formSMSContact}` | `{ qr: String, cb_logo: String }` |
| `POST /user/details` | `Authorization: cb_admin_token` | `{ userId }` | `{ details: [{ id, cb_id, fullName, sex, yearOfBirth, email, phone, date, hash, emailcontact, smscontact}] }` |
| `POST /user/details/update` | `Authorization: cb_admin_token` | `{ userId, userFullName, sex, yearOfBirth, email, phoneNumber, emailConsent, smsConsent }` | `{ details: { `☝️` } }` |
| `POST /user/name-from-scan` | `Authorization: std_token` | `{ hash }` | `String` or `{ fullname, hash }` |
| `POST /user/qr/email` | `Authorization: cb_admin_token` | `{ hash, email, name }` | `{ success: Bool }` |
| `POST /user/qr` | `Authorization: cb_admin_token` | `{ hash }` | `{ qr, cb_logo }` |
| `GET  /users/all` | `Authorization: cb_admin_token` | | `{ users: [{id, fullName, sex, yearofbirth, email, date}] }` |
| `GET  /users/chart-all` | `Authorization: cb_admin_token` | | `{ numbers: [[{ date }], [{ sex, count }], [{ name, count }], [{ ageCount }], [{ name }]] }` |
| `POST /users/filtered` | `Authorization: cb_admin_token` | `{ filterBy, orderBy }` | `{ users: [[{id, fullName, sex, yearofbirth, email, date}], [{ ageCount, ageGroups }], [{ name, count }], [{ sex, count }]] }` |
| `POST /visit/check` | `Authorization: std_token` | `{ formSender, formEmail, formPhone, formGender, formYear }` | `String` or `Bool` |
| `POST /visit/add` | `Authorization: std_token` | `{ hash, activity }` | `String` |
| `GET /visitors/all` | `Authorization: cb_admin_token` | | `{ users: [{ id, sex, yearofbirth, name, date }] }` |
| `POST /visitors/filtered` | `Authorization: cb_admin_token` | `{ filterBy: [], orderBy: String }` | `{ users: [{ id, sex, yearofbirth, name, date }] }` |
| `GET  /activities/all` | `Authorization: cb_admin_token` | | `{ activities: [{ id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday }] }` |
| `GET  /activities/today` | `Authorization: std_token` | | `{ activities: [{ id, name }] }` |
| `POST /activity/add` | `Authorization: cb_admin_token` | `{ name }` | `{ id }` |
| `POST /activity/update` | `Authorization: cb_admin_token` | `{ id, monday, tuesday, wednesday, thursday, friday, saturday, sunday }` | `{ success: String }` |
| `POST /activity/delete` | `Authorization: cb_admin_token` | `{ id }` | `{ success: String }` |
| `POST /cb/feedback` | `Authorization: std_token` | ` { query: { feedbackScore }` | `[ { result: { id, cb_id, feedback_score, feedback_date } } ]`|
| `GET  /cb/feedback` | `Authorization: cb_admin_token` | ` { since: date || null, until: date || null }` | `[ { result: { [feedback_score: num, count: num] } } ]`|
| `GET  /users/cb-name` | `Authorization: std_token` | | `[ { result: {cbOrgName, cbLogoUrl} } ]`|
| `POST  '/cb/export'` | `Authorization: cb_admin_token` | | `[ { result: { users: [{ visit_id, gender, yob, visitor_name, visit_date, activity }] }} ]` |
