# New API Detailed Description
This design is based on moving towards an API that is more RESTful, and attempting to keep request/response patterns consistent and predictable.

## Contents
1. [Standard Query Parameters](#standard-query-parameters)
2. [Standard Request Body](#standard-request-body)
3. [Standard Response Body](#standard-response-body)
4. [Error Response](#error-response)
5. [Accept and Content-Type Headers](#accept-and-content-type-headers)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Activities](#activities)
8. [CBs](#cbs)
9. [Visitors](#visitors)

## Standard Query Parameters
In general, filters should be supported through query params in `GET` requests (where such functionality is appropriate) by allowing the client to specify key-value pairs as query parameters, where the key corresponds to a field in the response body.

For example, in `GET /api/visitors`, the response body is:
```
{ result: [{ id, name, gender, email, ... }] }
```
We should specify a filter on `gender` and `email` in the following way:
```
GET /visitors?gender=foo&email=bar
```

In addition, the following query parameters should be standard:
* `fields`: Comma separated list of fields in the response body to return. For example, `GET /visitors?fields=name,gender` returns only the `name` and `gender` field in the response body, instead of the entire object.
* `sort`: Single field by which to sort results
* `order`: Order by which to sort field specified by `sort`. One of `asc` or `desc`
* `since`: ISO86001 date string (with timezone?) specifying the **earliest** time from which results should be returned. This is not always meaningful for every endpoint, and is therefore ignored in those cases.
* `until`: ISO86001 date string (with timezone?) specifying the **latest** time from which results should be returned. This is not always meaningful for every endpoint, and is therefore ignored in those cases.

Note: Specifying the query via the request body is preferred where possible. Query parameters are mostly intended for use by `GET` requests.



## Standard Request Body
```
{
  "query": {},
  "sort"?: { field: "asc" | "desc", ... },
  "filter"?: {}
}
```

## Standard Response Body
```
{
  "result"?: {} | [],
  "meta"?: {},
  "error"?: { "message": String, "validation"?: [String] }
}
```

## Error Response
All non-successful responses should return appropriate status codes in the range `4xx` or `5xx`, with `"result": null`, and a descriptive message in `"error": { "message": "..." }`. If the error is due to validation, the `"error"` object should have a key of `"validation"` which is an array of strings describing the validation errors.

## Accept and Content-Type Headers
Clients should set the `Accept` header in order to indicate what content-type(s) they expect as a response. If no `Accept` header is set, the API will default to a `application/json` content-type. The API will set the `Content-Type` header accurately to reflect the response format. The two response formats that should be supported are:
* JSON (MIME type: `application/json`)
* CSV (MIME type: `text/csv`)

## Authentication and Authorization
Clients are authenticated on the API via a JWT, which is passed through the `Authorization` header. Permissions are role-based, not fine-grain. The roles a client has are identified by the JWT signature. There are four roles, listed below.

* `NULL`: Un-authenticated user
* `CB`: Community business user
* `CB_ADMIN`: Community business user with elevated admin permissions
* `TWINE_ADMIN`: Twine platform admin user

The `CB_ADMIN` permission level is a short-lived authorization with broader rights than the `CB` permission level. It is attained via a permission escalation mechanism (currently confirming password).

## Activities
### `GET    /api/activities/`
#### CB
##### Response
```
[{
  id: Number,
  name: String,
  category: String,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}]
```

#### CB_ADMIN & TWINE_ADMIN
##### Response
```
[{
  id: Number,
  name: String,
  category: String,
  deleted: Boolean,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}]
```

### `POST   /api/activities/`
#### CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  name: String,
  category: String,
  monday?: Boolean,
  tuesday?: Boolean,
  wednesday?: Boolean,
  thursday?: Boolean,
  friday?: Boolean,
  saturday?: Boolean,
  sunday?: Boolean,
}
```

##### Response
```
{
  id: Number,
  name: String,
  category: String,
  deleted: Boolean,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}
```

### `GET    /api/activities/:id`
#### CB
##### Response
```
{
  id: Number,
  name: String,
  category: String,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}
```

#### CB_ADMIN & TWINE_ADMIN
##### Response
```
{
  id: Number,
  name: String,
  category: String,
  deleted: Boolean,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}
```

### `PUT    /api/activities/:id`
#### CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  name: String,
  category: String,
  monday?: Boolean,
  tuesday?: Boolean,
  wednesday?: Boolean,
  thursday?: Boolean,
  friday?: Boolean,
  saturday?: Boolean,
  sunday?: Boolean,
}
```

##### Response
```
{
  id: Number,
  name: String,
  category: String,
  deleted: Boolean,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  sunday: Boolean,
}
```

### `DELETE /api/activities/:id`
#### CB_ADMIN | TWINE_ADMIN
##### Response
```
null
```

## CBs
### `GET    /api/cbs/`
#### TWINE_ADMIN
##### Response
```
[{
  id: Number,
  name: String,
  email: String,
  logo_url?: String,
  region: String,
  sector: String,
  registered_at: String,
}]
```

### `POST   /api/cbs/`
#### NULL
##### Response
```
{
  id: Number,
  name: String,
  email: String,
  logo_url?: String,
  region: String,
  sector: String,
  password: String,
  password_confirm: String,
}
```

### `GET    /api/cbs/:id`
#### Note
The path parameter `id` may be replaced with `me` to refer to the `id` of the community business which is making the request

#### CB
##### Response
```
{
  id: Number,
  name: String,
  logo_url?: String,
  region: String,
  sector: String,
}
```

#### CB_ADMIN | TWINE_ADMIN
##### Response
```
{
  id: Number,
  name: String,
  email: String,
  logo_url?: String,
  region: String,
  sector: String,
  registered_at: String,
}
```

### `PUT    /api/cbs/:id`
#### Note
The path parameter `id` may be replaced with `me` to refer to the `id` of the community business which is making the request

#### CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  name?: String,
  email?: String,
  logo_url?: String,
  region?: String,
  sector?: String,
  password?: String,
  password_confirm?: String,
}
```

##### Response
```
{
  id: Number,
  name: String,
  email: String,
  logo_url?: String,
  region: String,
  sector: String,
  registered_at: String,
}
```

### `DELETE /api/cbs/:id`
#### Note
The path parameter `id` may be replaced with `me` to refer to the `id` of the community business which is making the request

#### TWINE_ADMIN
##### Response
```
null
```

### `POST   /api/cbs/:id/emails`
#### Note
The path parameter `id` may be replaced with `me` to refer to the `id` of the community business which is making the request

#### CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  template: String,
}
```

##### Response
```
{
  id: Number,
  name: String,
  email: String,
  logo_url?: String,
  region: String,
  sector: String,
  registered_at: String,
}
```

### `GET    /api/cbs/:id/feedback`
#### Note
The path parameter `id` may be replaced with `me` to refer to the `id` of the community business which is making the request

#### CB_ADMIN | TWINE_ADMIN
##### Response
```
[{
  id: Number,
  score: Number,
  feedback_date: String,
}]
```

### `POST   /api/cbs/password_reset`
#### NULL
##### Request
```
{
  email: String,
}
```
OR
```
{
  reset_token: String,
  password: String,
  password_confirm: String,
}
```

##### Response
```
null
```

### `POST   /api/cbs/login`
#### NULL
##### Request
```
{
  email: String,
  password: String,
}
```

##### Response
```
null
```

### `POST   /api/cbs/escalate`
#### CB
##### Request
```
{
  password: String,
}
```

##### Response
```
null
```

## Visitors
### `GET    /api/visitors/`
#### CB_ADMIN | TWINE_ADMIN
##### Response
```
[{
  id: Number,
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent: Boolean,
  sms_consent: Boolean,
}]
```

### `POST   /api/visitors/`
#### CB | CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent?: Boolean,
  sms_consent?: Boolean,
}
```

##### Response
```
{
  id: Number,
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent: Boolean,
  sms_consent: Boolean,
  qr_code_url: String,
}
```

### `GET    /api/visitors/:id`
#### CB_ADMIN | TWINE_ADMIN
##### Response
```
{
  id: Number,
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent: Boolean,
  sms_consent: Boolean,
  qr_code_url: String,
}
```

### `PUT    /api/visitors/:id`
#### CB_ADMIN | TWINE_ADMIN
##### Request
```
{
  name?: String,
  gender?: String,
  birth_year?: String,
  email?: String,
  phone_number?: String,
  email_consent?: Boolean,
  sms_consent?: Boolean,
}
```

##### Response
```
{
  id: Number,
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent: Boolean,
  sms_consent: Boolean,
  qr_code_url: String,
}
```

### `DELETE /api/visitors/:id`
#### CB_ADMIN | TWINE_ADMIN
##### Response
```
null
```

### `GET    /api/visitors/:id/visits`
#### CB_ADMIN | TWINE_ADMIN
##### Response
```
[{
  id: Number,
  activity: String,
  visit_date: String,
}]
```

### `POST   /api/visitors/:id/visits`
#### CB
##### Request
```
{
  activity: String,
}
```

##### Response
```
{
  id: Number,
  activity: String,
  visit_date: String,
}
```

### `GET    /api/visitors/:id/visits/:id`
#### CB_ADMIN
##### Response
```
{
  id: Number,
  activity: String,
  visit_date: String,
}
```

### `PUT    /api/visitors/:id/visits/:id`
#### CB_ADMIN
##### Request
```
{
  activity?: String,
  visit_date?: String,
}
```

##### Response
```
{
  id: Number,
  activity: String,
  visit_date: String,
}
```

### `DELETE /api/visitors/:id/visits/:id`
#### CB_ADMIN
##### Response
```
null
```

### `POST   /api/visitors/search`
#### CB_ADMIN
##### Request
```
{
  name?: String,
  gender?: String,
  birth_year?: Number,
  email?: String,
  password?: String,

}
```

##### Response
```
{
  name: String,
  gender: String,
  birth_year: String,
  email?: String,
  phone_number?: String,
  email_consent: Boolean,
  sms_consent: Boolean,
  qr_code_url: String,
}
```

### `POST   /api/visits/statistics`
TBD:
#### CB_ADMIN
##### Request
```
{
  group: {
    activity?: Boolean,
    visit_date?: {
      since: String,
      until: String
    },
    visitor?: {
      gender?: Boolean,
      age?: [ Number ],
    },
  },
}
```

##### Response
```
{
  activity: {
    <ACTIVITY_NAME>: [{ id: String, activity: String, visit_date: String }],
    ...
  },
  gender: {
    <GENDER_NAME>: [{ id: String, activity: String, visit_date: String }],
    ...
  },
}
```

## Design Resources
* [RESTful API Design Guidelines](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9)
* [Best Practices for Pragmatic RESTful API](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
