const test = require('tape');
const pg = require('pg');
const { getConfig } = require('../../../../config');
const { refresh: refreshDB } = require('../../../../db/scripts');
const visitorsFiltered = require('../visitors_filtered');


test('Visitors DB queries', async (tape) => {
  const config = getConfig(process.env.NODE_ENV);
  const client = new pg.Client(config.psql);
  await client.connect();

  tape.test('visitorsFiltered filters by gender', async (t) => {
    try {
      await refreshDB();

      const filterMale = await visitorsFiltered(client, 1, {
        filterBy: ['gender@male'],
      });
      const filterFemale = await visitorsFiltered(client, 1, {
        filterBy: ['gender@female'],
      });
      const filterPreferNotToSay = await visitorsFiltered(client, 1, {
        filterBy: ['gender@prefer_not_to_say'],
      });
      const filterMixed = await visitorsFiltered(client, 1, {
        filterBy: ['gender@male', 'gender@female', 'gender@prefer_not_to_say'],
      });
      const filterIncorrect = await visitorsFiltered(client, 1, {
        filterBy: ['gender@incorrect'],
      });
      const filterNone = await visitorsFiltered(client, 1, {
        filterBy: [],
      });
      const filterUndefined = await visitorsFiltered(client, 1);

      t.equals(filterMale.length, 21, 'Filter by male');
      t.equals(filterFemale.length, 42, 'Filter by female');
      t.equals(filterPreferNotToSay.length, 0, 'Filter by prefer_not_to_say');
      t.equals(filterMixed.length, 63, 'Filter by all of the above');
      t.equals(filterIncorrect.length, 63, 'Filter with an incorrect gender');
      t.equals(filterNone.length, 63, 'Filter with an empty array');
      t.equals(filterUndefined.length, 63, 'Filter with undefined');

      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed to filter by gender');
      t.end();
    }
  });

  tape.test('visitorsFiltered filters by age', async (t) => {
    try {
      await refreshDB();

      const filter017 = await visitorsFiltered(client, 1, {
        filterBy: ['age@0-17'],
      });
      const filter1834 = await visitorsFiltered(client, 1, {
        filterBy: ['age@18-34'],
      });
      const filter70more = await visitorsFiltered(client, 1, {
        filterBy: ['age@70-more'],
      });
      const filterBadValue = await visitorsFiltered(client, 1, {
        filterBy: ['age@bad-value'],
      });
      const filterAll = await visitorsFiltered(client, 1, {
        filterBy: [
          'age@0-17',
          'age@18-34',
          'age@35-50',
          'age@51-69',
          'age@70-more',
        ],
      });

      t.equals(filter017.length, 0, 'Filters by bottom case');
      t.equals(filter1834.length, 19, 'Filters by middle');
      t.equals(filter70more.length, 0, 'Filters by top case');
      t.equals(filterBadValue.length, 63, "Doesn't filter bad inputs");
      t.equals(filterAll.length, 63, 'Filters with all age cases');
      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed to filter by age');
      t.end();
    }
  });

  tape.test('Filters by activity', async (t) => {
    try {
      await refreshDB();

      const filterNamedActivity = await visitorsFiltered(client, 1, {
        filterBy: ['activity@Yoga'],
      });
      const filterTwoNamedActivities = await visitorsFiltered(client, 1, {
        filterBy: ['activity@Self-Defence Class', 'activity@Yoga'],
      });
      const filterBadActivityName = await visitorsFiltered(client, 1, {
        filterBy: ['activity@no-activity'],
      });
      const noSqlInjection = await visitorsFiltered(client, 1, {
        filterBy: ["activity@activity'; TRUNCATE TABLE activities;"],
      });

      t.equals(filterNamedActivity.length, 16, 'Filters by activity');
      t.equals(filterTwoNamedActivities.length, 31, 'Filters multiple activities');
      t.equals(filterBadActivityName.length, 0, "Doesn't allow bad results");
      t.equals(noSqlInjection.length, 0, "Doesn't allow sql inputs");
      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed to filter by activity');
      t.end();
    }
  });

  tape.test('Filters work when mixed', async (t) => {
    try {
      await refreshDB();

      const mixedFilters = await visitorsFiltered(client, 1, {
        filterBy: ['activity@Self-Defence Class', 'age@35-50', 'gender@male'],
      });

      t.equals(mixedFilters.length, 2, 'Filters with mixed filter types');
      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed to filter with multiple filters types');
      t.end();
    }
  });

  tape.test('Works with bad values', async (t) => {
    try {
      await refreshDB();

      const badValue = await visitorsFiltered(client, 1, {
        filterBy: [null, 0, '', undefined, 'no'],
        orderBy: null,
      });

      t.equal(badValue.length, 63, 'Works for filters without an @');
      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed with bad values');
      t.end();
    }
  });

  tape.test('Sorts by field', async (t) => {
    try {
      await refreshDB();

      const allResults = await visitorsFiltered(client, 1);
      const sortedByYear = allResults.map((o) => o.yearofbirth).sort();

      const sortByYear = await visitorsFiltered(client, 1, {
        orderBy: 'yearofbirth',
      });

      const sortWithFilter = await visitorsFiltered(client, 1, {
        orderBy: 'activity',
        filterBy: ['gender@male'],
      });
      const filterByMale = await visitorsFiltered(client, 1, {
        filterBy: ['gender@male'],
      });

      const sortByBadValue = await visitorsFiltered(client, 1, {
        orderBy: 'badvalue',
      });

      t.deepEqual(sortByYear.map((o) => o.yearofbirth), sortedByYear, 'Sorts by year');
      t.notDeepEqual(sortByYear, allResults, 'Double check sort by year');

      t.equal(sortWithFilter.length, 21, 'Sort can be combined with filter');
      t.notDeepEqual(sortWithFilter, filterByMale, 'Sort+filter changes result');

      t.equal(sortByBadValue.length, 63, 'Cannot sort by bad value');

      t.end();
    } catch (e) {
      console.log(e);
      t.fail('Failed to sort');
      t.end();
    }
  });

  tape.test('Visitors DB queries | teardown', (t) => client.end(t.end));
});
