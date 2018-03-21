# Stack

## Contents
1. [Database](#database)
2. [Backend](#backend)
3. [Frontend](#frontend)
4. [3rd Party Services](#3rd-party-services)
4. [Reference](#reference)


## Database
[PostgreSQL](https://www.postgresql.org) is used for all data persistence.

## Backend
The server-side application is written in [Node.js](https://nodejs.org/) using the [Express](http://expressjs.com/) framework.

## Frontend
The client-side application is a single-page application written using the [React](https://reactjs.org) framework, bootstrapped with [Create-React-App](https://github.com/facebookincubator/create-react-app). QR code generation is handled using the `[qrcode](https://github.com/soldair/node-qrcode)` package, and QR code scanning is handled using the [Instascan](https://github.com/schmich/instascan) HTML5 QR webcam scanner.

## 3rd Party Services
[Postmark](http://postmarkapp.com/) is used to send e-mails using pre-determined templates.

## Reference
1. [Create React App](https://github.com/facebookincubator/create-react-app)
2. [Advice on using React with an Express server](https://daveceddia.com/create-react-app-express-backend/)
3. [Create React App with Express in Production](https://daveceddia.com/create-react-app-express-production/)
4. [React Router](https://reacttraining.com/react-router/)
5. [Codeacademy Course on React](https://www.codecademy.com/learn/react-101)
