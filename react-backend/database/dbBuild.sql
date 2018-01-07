BEGIN;
  DROP TABLE IF EXISTS users
  CASCADE;
DROP TABLE IF EXISTS visits
CASCADE;
DROP TABLE IF EXISTS activities
CASCADE;
DROP TABLE IF EXISTS cbusiness
CASCADE;
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  sex VARCHAR(30) NOT NULL,
  yearOfBirth INTEGER NOT NULL,
  email VARCHAR(100),
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hash VARCHAR(64) NOT NULL
);
CREATE TABLE cbusiness
(
  id SERIAL PRIMARY KEY,
  org_name VARCHAR(100) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  hash_pwd VARCHAR(64) NOT NULL,
  token VARCHAR(100),
  tokenExpire BIGINT,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE activities
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
  -- date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- cb_id INTEGER REFERENCES cbusiness
);
CREATE TABLE visits
(
  id SERIAL PRIMARY KEY,
  usersId INTEGER REFERENCES users,
  activitiesId INTEGER REFERENCES activities,
  -- cb_id INTEGER REFERENCES cbusiness,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users
  (fullName, sex, yearOfBirth, email, date, hash)
VALUES
  ('james bond', 'male', 1984, 'hello@yahoo.com', '2017-05-15 12:24:56', '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955'),
  ('britney spears', 'female', 1982, 'goodbye@gmail.com', '2017-05-15 12:24:56', '9b57815dcc7568e942baed14c61f636034f138e5f43d72f26ec32a9069f9d7df'),
  ('aldous huxley', 'female', 1993, 'sometimes@gmail.com', '2017-05-15 12:24:56', 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a770cf1417b282f1d1afa');
INSERT INTO activities
  (name)
VALUES
  ('Yoga'),
  ('French Lessons'),
  ('Baking Lessons'),
  ('Self-Defence Class'),
  ('Flamenco Dancing');
INSERT INTO visits
  (usersId, activitiesId, date)
VALUES
  (1, 4, '2017-05-15 12:24:56'),
  (2, 1, '2017-06-21 14:32:30'),
  (3, 2, '2017-05-15 12:01:20'),
  (1, 3, '2017-07-02 09:57:01'),
  (2, 4, '2017-04-29 20:03:17'),
  (3, 5, '2017-06-22 17:45:00');
INSERT INTO cbusiness
  (org_name, genre, email, hash_pwd, date)
VALUES
  ('Dog & Fish', 'pub', 'dev@milfordcapitalpartners.com', '9345a35a6fdf174dff7219282a3ae4879790dbb785c70f6fff91e32fafd66eab', '2017-05-15 12:24:56');
COMMIT;
