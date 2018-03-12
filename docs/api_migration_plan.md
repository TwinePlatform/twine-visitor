# HTTP API Migration Plan
Throughout, a question mark (`?`) indicates fields in objects that are optional or nullable.

## Current API
| Path | Headers | Request Body | Response Body |
|:----|:----:|:----:|:----:|
| `POST /admin/login` | `Authorization: std_token` | `{ password }` | `{ success: Bool, reason?: String, token?: String }` |
| `POST /admin/check` | `Authorization: cb_admin_token` | | `{ success: Bool }` |
| `POST /cb/register` | | `{ formPswd, formName, formEmail, formGenre }` | `{ success: Bool }` |
| `POST /cb/register/check` | | `{ formPswd, formName, formEmail, formGenre }` | `{ success: Bool }` |
| `POST /cb/login` | | `{ formEmail, formPswd }` | `{ success?: Bool, reason?: String, token?: String }` |
| `POST /cb/pwd/change` | | `{ formPswd, formPswdConfirm, token }` | `String?` or `Bool` |
| `POST /cb/pwd/reset` | | `{ formEmail }` | `String?` or `Bool` |
| `POST /cb/details` | `Authorization: cb_admin_token` | | `[{ id, org_name, genre, email, uploadedFileCloudinaryUrl, token, tokenExpire, date }]` |
| `POST /cb/details/update` | `Authorization: cb_admin_token` | `{ org_name, genre, email, uploadedFileCloudinaryUrl }` | `{ details: { `☝️` } }` |
| `POST /qr/generator` | `Authorization: std_token` | `{ formSender, formPhone, formGender, formYear, formEmail, formEmailContact, formSMSContact}` | `{ qr: String, cb_logo: String }` |
| `POST /user/details` | `Authorization: cb_admin_token` | `{ userId }` | `{ details: [{ id, cb_id, fullName, sex, yearOfBirth, email, date, hash }] }` |
| `POST /user/details/update` | `Authorization: cb_admin_token` | `{ userId, userFullName, sex, yearOfBirth, email, phone, is_email_contact_consent_granted, is_sms_contact_consent_granted }` | `{ details: { `☝️` } }` |
| `POST /user/name-from-scan` | `Authorization: std_token` | `{ user: SHA256 }` | `String` or `{ fullname, hash }` |
| `POST /user/qr/email` | `Authorization: cb_admin_token` | `{ hash, email, name }` | `{ success: Bool }` |
| `POST /user/qr` | `Authorization: cb_admin_token` | `{ hash }` | `{ qr, cb_logo }` |
| `GET  /users/all` | `Authorization: cb_admin_token` | | `{ users: [{id, fullName, sex, yearofbirth, email, date}] }` |
| `GET  /users/chart-all` | `Authorization: cb_admin_token` | | `{ numbers: [[{ date }], [{ sex, count }], [{ name, count }], [{ ageCount }], [{ name }]] }` |
| `POST /users/filtered` | `Authorization: cb_admin_token` | `{ filterBy, orderBy }` | `{ users: [[{id, fullName, sex, yearofbirth, email, date}], [{ ageCount, ageGroups }], [{ name, count }], [{ sex, count }]] }` |
| `POST /visit/check` | `Authorization: std_token` | `{ formSender, formEmail, formPhone, formGender, formYear }` | `String` or `Bool` |
| `POST /visit/add` | `Authorization: std_token` | `{ hash, activity }` | `String` |
| `POST /visitors/all` | `Authorization: cb_admin_token` | | `{ users: [{ id, sex, yearofbirth, name, date }] }` |
| `POST /visitors/filtered` | `Authorization: cb_admin_token` | `{ filterBy: [], orderBy: String }` | `{ users: [{ id, sex, yearofbirth, name, date }] }` |
| `GET  /activities/all` | `Authorization: cb_admin_token` | | `{ activities: [{ id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday }] }` |
| `GET  /activities/today` | `Authorization: cb_admin_token` | | `{ activities: [{ id, name }] }` |
| `POST /activity/add` | `Authorization: cb_admin_token` | `{ name }` | `{ id }` |
| `POST /activity/update` | `Authorization: cb_admin_token` | `{ activity: { id, monday, tuesday, wednesday, thursday, friday, saturday, sunday } }` | `{ success: String }` |
| `POST /activity/delete` | `Authorization: cb_admin_token` | `{ id }` | `{ success: String }` |


## New API
This design is based on moving towards an API that is more RESTful, and attempting to keep request/response patterns consistent and predictable.

### Standard Request Body
```
{
  "query": {},
  "sort"?: {},
  "filter"?: {}
}
```

### Standard Response Body
```
{
  "result"?: {} | [],
  "meta"?: {},
  "error"?: { "message": String, "validation"?: [String] }
}
```

### Error Response
All non-successful responses should return appropriate status codes in the range `4xx` or `5xx`, with `"result": null`, and a descriptive message in `"error": { "message": "..." }`. If the error is due to validation, the `"error"` object should have a key of `"validation"` which is an array of strings describing the validation errors.

### Routes
| Path | Headers | Request Body | Response Body | Replaces |
|:----|:----:|:----:|:----:|:----|
| `GET    /activities` | `Authorization: cb_admin_token` | | `{ result: [{ id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday }] }` | `GET  /activities/all` |
| `GET    /activities?weekday=today` | `Authorization: cb_admin_token` | | `{ result: [{ id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday }] }` | `GET  /activities/today` |
| `POST   /activities` | `Authorization: cb_admin_token` | `{ query: { name, monday?, tuesday?, wednesday?, thursday?, friday?, saturday?, sunday? } }` | `{ result: { id } }` | `POST /activity/add` |
| `PUT    /activities/:id` | `Authorization: cb_admin_token` | `{ query: { name?, monday?, tuesday?, wednesday?, thursday?, friday?, saturday?, sunday? } }` | `{ result: { id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday } }` | `POST /activity/update` |
| `DELETE /activities/:id` | `Authorization: cb_admin_token` | `{ query: { id } }` | `{ result: null }` | `POST /activity/delete` |
| `GET    /visitors` | `Authorization: cb_admin_token` | | `{ result: [{ visitor: { id, gender, yob }, visits: { activity, visit_date } }] }` | `POST /visitors/all` |
| `GET    /visitors?name=X&email=Y&gender=Z&age_brackets=18,35,51,70` | `Authorization: cb_admin_token` | | `{ result: [{ visitor: { id, gender, yob }, visits: [{ activity, visit_date }] }] }` | `POST /visitors/filtered` <br/> `POST /visit/check` |
| `GET    /visitors` | `Authorization: cb_admin_token` | | `{ result: [{ id, name, gender, yob, email, signup_date }] }` | `POST /users/all` |
| `GET    /visitors/:id` | `Authorization: cb_admin_token` | | `{ result: { visitor: { id, name, gender, yob, email, signup_date, qr_code_url, cb_logo_url } } }` | `POST /user/details` <br/> `POST /user/qr` |
| `POST   /visitors` | `Authorization: cb_admin_token` | `{ name, gender, yob, email }` | `{ result: { id, name, gender, yob, email, qr_code_url, cb_logo_url } }` | `POST /qr/generator` |
| `POST   /visitors/:id/emails` | `Authorization: cb_admin_token` | `{ query: { qr: true } }` | `{ result: null }` | `POST /user/qr/email` |
| `POST   /visitors/:id/visits` | `Authorization: std_token` | `{ query: { activity } }` | `{ result: null }` | `POST /visit/add` |
| `POST   /visitors/login` | | `{ query: { email, password } }` | `{ result: { std_admin_token } }` | `POST /cb/login` |
| `POST   /visitors/search` | `Authorization: std_token` | `{ query: { hash } }` | `{ result: { id, gender, yob, visits: [{ activity, visit_date }] } }` | `POST /user/name-from-scan` |
| `PUT    /visitors/:id` | `Authorization: cb_admin_token` | `{ query: { name?, gender?, yob?, email? } }` | `{ result: { id, name, gender, yob, email, signup_date, qr_code_url } }` | `POST /user/details/update` |
| `GET    /cbs/:id` | `Authorization: cb_admin_token` | | `{ result: { id, org_name, category, email, logo_url, signup_date } }` | `POST /cb/details` |
| `PUT    /cbs/:id` | `Authorization: cb_admin_token` | `{ query: { org_name?, category?, email?, logo_url? } }` | `{ result: { id, org_name, category, email, logo_url, signup_date } }` | `POST /cb/details/update` |
| `PUT    /cbs/:id` | `Authorization: reset_token` | `{ query: { password, password_confirm } }` | `{ result: { id, org_name, category, email, logo_url, signup_date } }` | `POST /cb/pwd/change` |
| `POST   /cbs` | | `{ query: { org_name, category, email, password, password_confirm, logo_url? } }` | `{ result: { id, org_name, category, email, logo_url, signup_date } }` | `POST /cb/register` <br/> `POST /cb/register/check` |
| `POST   /cbs/login` | | `{ query: { email, password } }` | `{ result: { cb_admin_token } }` | `POST /admin/login` |
| `POST   /cbs/:id/emails` | | `{ query: { password_reset: Bool } }` | `{ result: null }` | `POST /cb/pwd/reset` |
| `POST   /visitors/statistics` | `Authorization: cb_admin_token` | `{ query: { group_by: { gender, activity, age: [18, 35, 51, 70], days: ['monday'] } }` | `{ result: { gender: { male, female, ... }, activity: { yoga: 12, ...}, age: { 0-17: 2, ... }, days: { monday: 2, ... } } }` | `POST /users/chart-all` <br/> `POST /users/filtered` |
