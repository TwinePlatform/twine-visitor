# Configuration Guide

All configuration is stored in the project root in `.env*` files. Secrets and configuration variables that are likely to change between deployment environments are stored in these files.

To create a project configuration, create a `.env` file in the project root. Populate it with `=`-separated key-value pairs. Ensure at least the following parameters are provided:

```sh
# Base URL to use as a prefix for all API calls
# This is used to support cases where the API is not hosted on the same domain as the application itself.
API_HOST_DOMAIN=https://...
```
