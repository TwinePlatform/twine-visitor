# 🗃 Database Backups

The PostgreSQL database is hosted on Heroku.

## Schedule Backups
Backups are scheduled to run everyday at 3am, and are retained for 7 days. 

Current status of backups
```
heroku pg:backups --app [app-name]
```
❗️ If at any point heroku is upgraded from hobby to production tier, backups will need to be rescheduled.

Change backup schedule
```
heroku pg:backups:schedule DATABASE_URL --at '[time] [TZ format]' --app [app-name]
```
## Local Test Restore
A test restore can either be done locally or on a staging pipeline to check the integrety of the backup. Be careful not to restore to the production database as it will be wiped during the process 😨.

Download backup
```
heroku pg:backups:download [backup-name] --app [app-name]
```
_NB:_ this will download the backup to your current directory. If a `lastest.dump` file already exists, it will append a sequential version number eg `latest.dump.5`

Create a local database
```
pgcli (or other postgres interface)

CREATE DATABASE [database-name]
```
_Exit postgres interface_

Restore the downloaded backup to your local database
```
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U [username] -d [database-name] latest.dump
```

You can now connect your local app to the restored database.

## Resources
- [Heroku PostgreSQL backups](https://devcenter.heroku.com/articles/heroku-postgres-backups)
- [Heroku importing and exporting PostgreSQL databases](https://devcenter.heroku.com/articles/heroku-postgres-import-export)