const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const genderNumbers = require('../users_chart_all');

const config = getConfig(process.env.NODE_ENV);

test('DB Query | users_chart_all', async tape => {
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('users_chart_all | existing cb', async t => {
    try {
      await refreshDB();

      const query = await genderNumbers(client, 1);
      const actualVisitsNumbers = query[0];
      const actualGenderNumbers = query[1];
      const actualActivitiesNumbers = query[2];
      const actualVisitorsByAge = query[3];
      const actualActivities = query[4];

      const expectedVisitsNumbers = [
        { date: 1494851096000 },
        { date: 1498055550000 },
        { date: 1494849680000 },
        { date: 1498989421000 },
        { date: 1516737857000 },
        { date: 1516737917000 },
        { date: 1516737977000 },
        { date: 1516738037000 },
        { date: 1516738097000 },
        { date: 1516824557000 },
        { date: 1516824617000 },
        { date: 1516824797000 },
        { date: 1516825397000 },
        { date: 1516825997000 },
        { date: 1516826597000 },
        { date: 1516827197000 },
        { date: 1516827797000 },
        { date: 1516910477000 },
        { date: 1516910537000 },
        { date: 1516910597000 },
        { date: 1516910657000 },
        { date: 1516910717000 },
        { date: 1516910777000 },
        { date: 1516910837000 },
        { date: 1516910897000 },
        { date: 1516910957000 },
        { date: 1516996877000 },
        { date: 1516996937000 },
        { date: 1516996997000 },
        { date: 1516997057000 },
        { date: 1516997117000 },
        { date: 1516997177000 },
        { date: 1516997237000 },
        { date: 1516997297000 },
        { date: 1516997357000 },
        { date: 1516997417000 },
        { date: 1517000597000 },
        { date: 1517083277000 },
        { date: 1517083337000 },
        { date: 1517083397000 },
        { date: 1517083457000 },
        { date: 1517083517000 },
        { date: 1517083577000 },
        { date: 1517083637000 },
        { date: 1517083697000 },
        { date: 1517170157000 },
        { date: 1517173397000 },
        { date: 1517176997000 },
        { date: 1517180597000 },
        { date: 1517169807000 },
        { date: 1517169817000 },
        { date: 1517169827000 },
        { date: 1517169837000 },
        { date: 1517169787000 },
        { date: 1517173997000 },
        { date: 1517170397000 },
        { date: 1517170997000 },
        { date: 1493497997000 },
        { date: 1493498597000 },
        { date: 1493499197000 },
        { date: 1493499797000 },
        { date: 1493503397000 },
        { date: 1498153500000 },
      ];
      const expectedGenderNumbers = [
        { sex: 'male', count: '1' },
        { sex: 'female', count: '2' },
      ];
      const expectedActivitiesNumbers = [
        { name: 'Flamenco Dancing', count: '6' },
        { name: 'Baking Lessons', count: '13' },
        { name: 'French Lessons', count: '13' },
        { name: 'Self-Defence Class', count: '15' },
        { name: 'Yoga', count: '16' },
      ];
      const expectedVisitorsByAge = [
        { agecount: '2', agegroups: '35-50' },
        { agecount: '1', agegroups: '18-34' },
      ];
      const expectedActivities = [
        { name: 'Yoga' },
        { name: 'French Lessons' },
        { name: 'Baking Lessons' },
        { name: 'Self-Defence Class' },
        { name: 'Flamenco Dancing' },
      ];

      t.deepEquals(
        actualVisitsNumbers,
        expectedVisitsNumbers,
        'genderNumbers returns dates of visits as first element of array'
      );

      t.deepEquals(
        actualGenderNumbers.sort((a, b) => a.count - b.count),
        expectedGenderNumbers.sort((a, b) => a.count - b.count),
        'genderNumbers returns gender count as second element of array'
      );

      t.deepEquals(
        actualActivitiesNumbers.sort((a, b) => a.count - b.count),
        expectedActivitiesNumbers.sort((a, b) => a.count - b.count),
        'genderNumbers returns activies count as third element of array'
      );

      t.deepEquals(
        actualVisitorsByAge,
        expectedVisitorsByAge,
        'genderNumbers returns age count as fourth element of array'
      );

      t.deepEquals(
        actualActivities,
        expectedActivities,
        'genderNumbers returns activities list as fifth element of array'
      );

      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('users_chart_all | non-existing cb', async t => {
    try {
      await refreshDB();

      const actual = await genderNumbers(client, 707);
      const expected = [[], [], [], [], []];

      t.deepEquals(
        actual,
        expected,
        'genderedNumbers returns a array of empty arrays for non-existent cb'
      );
      t.end();
    } catch (error) {
      t.end(error);
    }
  });

  tape.test('users_chart_all | no cb arg', async t => {
    try {
      await refreshDB();
      await genderNumbers(client);
    } catch (error) {
      t.ok(
        error,
        'genderedNumbers throws an error when a cb id is not supplied'
      );
      t.end();
    }
  });

  tape.test('users_chart_all | Teardown', t => client.end(t.end));
});
