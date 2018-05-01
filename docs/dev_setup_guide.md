# Developer Setup Guide

## Contents

1.  [Pre-requisites](#prerequisites)
2.  [Getting started](#getting-started)
3.  [Database](#database)
4.  [Configuration](#configuration)
5.  [Server app](#server-app)
6.  [Client app](#client-app)

## Pre-requisites

* `node` (v8.4.0+) and `npm` (v5.6.0+)
* `postgresql` (v9.4+)

## Getting Started

Clone the repo with `https` or `ssh`:

```sh
# https
git clone https://github.com/TwinePlatform/twine-visitor.git
```

```sh
# ssh
git clone git@github.com:TwinePlatform/twine-visitor.git
```

After cloning, `cd` into the repo and install dependencies:

```sh
npm i
```

This will install dependencies for both the server and client apps.

## Database

Start the postgres server.

Create two databases, one for testing locally, one for running the app locally, using either the `createdb` utility or by connecting to the Postgres server and running the equivalent SQL command.

```sh
createdb <DB_NAME>
```

```SQL
CREATE DATABASE <DB_NAME>;
```

## Configuration

To configure the application see the [configuration guide](./config_guide.md).

## Server App

The server application code is located in `/react-backend`. Before starting the server for the first time, build the database with

```sh
npm run db_build
```

Then run

```sh
npm start
```

To test the application, run

```sh
npm test
```

This will also collect coverage information.

## Client App

The client application is located in `/react-backend/client`, and is bootstrapped with `create-react-app`. All the standard commands are supported (`start`, `build`, `test`, `eject`).
