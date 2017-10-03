BEGIN;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS activities CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  sex VARCHAR(15) NOT NULL,
  yearOfBirth INTEGER NOT NULL,
  email VARCHAR(100),
  hash VARCHAR(64) NOT NULL
);

CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  users.id FOREIGN KEY NOT NULL,
  activities.id FOREIGN KEY NOT NULL,
  date DATETIME NOT NULL
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO users (fullName, sex, yearOfBirth, email, hash) VALUES
('James Inglis', 'Male', 1992, 'jinglis12@googlemail.com', '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955'),
('Alina Solinas', 'Female', 1988, 'azayneeva@gmail.com', '9b57815dcc7568e942baed14c61f636034f138e5f43d72f26ec32a9069f9d7df'),
('Rachael ORourke', 'Female', 1987, 'rorourke.rsp@gmail.com', 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a770cf1417b282f1d1afa');

INSERT INTO visits (users.id, activities.id, date) VALUES
(0, 3, 2017-05-15 12:24:56),
(1, 0, 2017-06-21 14:32:30),
(2, 1, 2017-05-15 12:01:20),
(0, 2, 2017-07-02 09:57:01),
(1, 3, 2017-04-29 20:03:17),
(2, 4, 2017-06-22 17:45:00);

INSERT INTO activities (name, description) VALUES
('Yoga', 'Become Super flexible and dangerously supple, with Mina the Magical!'),
('French Lessons', 'Bring out your inner parisian with these easy to follow and in-depth lessons by Madame Amelie!'),
('Baking Lessons', 'Wow your friends and family with these deliciously simple lessons from our own Masterchef Jamie Olivers!'),
('Self-Defence Class', 'Civilise the mind but make savage the body! Sensai Bruce Wayne will empower you with raw martial energy!'),
('Flamenco Dancing', 'Free yourself from all of that stress and dance all night like a Spanish heartbreaker with Rebecca Gonzalez!'),

COMMIT;
