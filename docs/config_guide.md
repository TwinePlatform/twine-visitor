# Configuration Guide
Currently all configuration is done via a single git-ignored configuration file in the project root.

To create a project configuration, create a file named `config.env` in the project root. Populate it with `=`-separated key-value pairs. Ensure at least the following parameters are provided:

```sh
# Used to sign JWT for community business (CB) users
SECRET=...

# Used to sign JWT for admin users
ADMIN SECRET=...

# what?
POSTMARK_SERVER=...

# what?
CB_EMAIL=foo@bar.com

# Full postgres URL to the development postgres server
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>?ssl=1

# Full postgres URL to the testing postgres sever
DATABASE_TEST=postgres://<username>:<password>@<host>:<port>/<database_name>?ssl=0
```
