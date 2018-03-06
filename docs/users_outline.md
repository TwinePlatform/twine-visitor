# Users Outline

This app is designed for 3 different user types:

- [Visitor](#visitor)
- [Cb Admin](#cb-admin)
- [Twine Admin](#twine-admin)

## Vistor
Vistors are given a login connected to one community business. Each user is given a QR code for quick login and given a JWT which is signed with `STANDARD_JWT_SECRET`. When they login they can state which class they are visiting.

N.B. A community business must login first, before a visitor can use the app. 

## Cb Admin
Cb admin allows a community business to sign into the app from the home screen. This will then allow vistors to sign in. On first login Cb admins are signed in with a `STANDARD_JWT_SECRET`. They then have access to their community business admin section, which allows them to change their settings. This login is signed with a `CB_ADMIN_JWT_SECRET` which lasts for 5 minutes.

## Twine Admin
_Coming soon..._