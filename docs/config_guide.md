# Configuration Guide

All configuration is stored in the `config` directory located in the project root.

Secrets and configuration variables that are likely to change between deployment environments are stored in a file called `config.env`. This file should _NOT_ be checked into source control.

Default configuration variables are stored in `config.defaults.js`.

To create a project configuration, create the `config.env` in the `config` directory. Populate it with `=`-separated key-value pairs. Ensure at least the following parameters are provided:

```sh
# Used as a HMAC key to hash passwords (must change, see https://github.com/TwinePlatform/twine-visitor/issues/213)
HMAC_SECRET=...

# Used to sign JWTs for session authentication
STANDARD_JWT_SECRET=...
CB_ADMIN_JWT_SECRET=...

# Postgres connection strings for postgres server in various environments
# DATABASE_URL is used in production, the others are suffixed with their environments
DATABASE_URL=...
DATABASE_URL_DEV=...
DATABASE_URL_TEST=...

# Postmark API key for various environments
# Postmark is the service used to send e-mails
# NOTE: Use "POSTMARK_API_TEST" as the API key in the "test" environment, this will prevent sending
#       emails when not in production. You may want a real API key in the "dev" environment to allow
#       manual testing
#       See https://github.com/TwinePlatform/twine-visitor/issues/240
POSTMARK_KEY_DEV=...
POSTMARK_KEY_TEST=...
POSTMARK_KEY_PROD=...

```
