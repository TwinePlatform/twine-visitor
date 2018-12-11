# Configuration Guide

## Client
All client configuration is stored in the project root in `.env*` files. Secrets and configuration variables that are likely to change between deployment environments are stored in these files.

To create a project configuration, create a `.env` file in the project root. Populate it with `=`-separated key-value pairs. Ensure at least the following parameters are provided:

```sh
# Base URL to use as a prefix for all API calls
# This is used to support cases where the API is not hosted on the same domain as the application itself.
# NOTE:
#   When proxying via the server using the PROXY_API_URL variable, this value MUST be a relative URL
#   (that is, beginning with "/")
# Example:
#   Without proxy:
#     https://api.example.com/v1
#   With proxy:
#     /v1
REACT_APP_API_HOST_DOMAIN=<base_url>/<version_number>
```

## Server
The server may be configured with the following environment variables:
```sh
# Hostname from which to redirect
# MUST NOT INCLUDE PROTOCOL
# Example:
#   twine-visitor.herokuapp.com
REDIR_FROM_HOST=...

# Hostname to which to redirect
# SHOULD INCLUDE PROTOCOL
# Example:
#   https://example.com
REDIR_TO_HOST=...

# Used to enable a proxy to a separate API server to avoid CORS issues
# Example:
#   https://api.example.com/v1
PROXY_API_URL=...

# Port on which to listen
PORT=...
```
