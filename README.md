# Datapower
A user data-collection service for [Power to Change](http://www.powertochange.org.uk/)'s [Twine](http://www.twine-together.com/) platform, brought to you by [@azayneeva](https://github.com/azayneeva), [@RogeredBacon](https://github.com/RogeredBacon) and [@rachaelcodes](https://github.com/rachaelcodes).

See it in action at datapower.herokuapp.com.
![screenshot](https://user-images.githubusercontent.com/23265724/31492598-b498f432-af43-11e7-95ea-b598536c26d1.jpeg)

## The challenge Datapower tackles
Power to Change works with community businesses across the UK. Their clients wanted a way to find out which of their services were most popular, and whether this changed over different demographic groups.

The community business owners themselves did not always have time to check who was attending which activities. It was also important that the process of customers sharing information was confidential and quick.

![](https://user-images.githubusercontent.com/24795752/31504392-2f8b21bc-af6a-11e7-9a79-98ffc0b2bfe4.png)

## What Datapower does
When a user registers with the site, Datapower gives them a QR code (which can be downloaded, printed or photographed) to identify them.

On subsequent visits to the community business, the user can quickly sign in with their QR code (accessed through a webcam), then select a chosen activity from a list of options. Their user information and activity selected is then saved on the database.

The local business owners will then be able to retrieve information about the popularity of their different offers, and whether this changes according to demographic groups. This can help them tailor their services to the needs and preferences of their local community.

![Datapower walkthrough](https://user-images.githubusercontent.com/23265724/31492017-33806fd0-af41-11e7-9af8-a38a424dc906.gif)
(*Oops, spot the Kilgore/Kilgrave mistake...*)

## How Datapower works

The website is built in [React](https://reactjs.org/) with [Create React App](https://github.com/facebookincubator/create-react-app), using an [Express](https://expressjs.com/) server and a [PostgreSQL](https://www.postgresql.org/) database.

The QR code is generated using the [qrcode](https://github.com/soldair/node-qrcode) node module, and the scanning is then run with the [Instascan](https://github.com/schmich/instascan) HTML5 QR webcam scanner.

## Documentation
Please see the [docs](./docs) directory for project documentation.

## Useful links

1. [Create React App](https://github.com/facebookincubator/create-react-app)
2. [Advice on using React with an Express server](https://daveceddia.com/create-react-app-express-backend/)
3. [Create React App with Express in Production](https://daveceddia.com/create-react-app-express-production/)
4. [React Router](https://reacttraining.com/react-router/)
5. [Codeacademy Course on React](https://www.codecademy.com/learn/react-101)

## Thanks

* Our Mothers and Fathers for bringing us into this world, and supporting us through our mad *I'm a developer now!* epoch.
* Tim Berners Lee for inventing the internet; thanks  for our addiction dude.
* SimplyFresh for sustaining us through the high and the low, the hummus and the chocolate.
* Delonghi our trusty coffee machine without which we would still be scratching around on the floor like animals.
* Lastly we would like to thank our talented, tenacious, turbulent and unusually attractive team for all their hard work and commitment. Guys we are the *BEST!*
