const test = require('tape');
const activities = require('../../react-backend/database/queries/activities');
const activitiesForToday = require('../../react-backend/database/queries/activities_today');
const deleteActivity = require('../../react-backend/database/queries/activity_delete');
const insertActivity = require('../../react-backend/database/queries/activity_add');
const updateActivity = require('../../react-backend/database/queries/activity_update');

const rebuild = require('../../react-backend/database/database_rebuild');
const clean = require('../../react-backend/database/database_clean');

test('Tests activities responds with the correct data', async (t) => {
  await rebuild();

  const activityArray = await activities(2);

  t.equal(activityArray.length, 5, 'Activities gets all activities');
  t.equal(Object.keys(activityArray[0]).length, 9, 'Activity has 9 fields');

  try {
    await activities();
    t.fail('Worked without a cb id');
  } catch (e) {
    t.pass('Activities errors when no cb id given');
  }

  await clean();

  const activityArrayEmpty = await activities(2);

  t.deepEqual(activityArrayEmpty, [], 'No error if activities is called on empty table');
  t.end();
});

test('Tests activitiesForToday responds with activities by day', async (t) => {
  await rebuild();

  const activitiesMonday = await activitiesForToday(2, 'monday');
  const activitiesTuesday = await activitiesForToday(2, 'tuesday');
  const badCbId = await activitiesForToday(500, 'monday');
  try {
    await activitiesForToday(2, null);
    t.fail('Worked with a bad day value');
  } catch (e) {
    t.pass('Bad values rejected');
  }
  try {
    await activitiesForToday(null, 'monday');
    t.fail('Worked without a cb id');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  t.equal(activitiesMonday.length, 4, 'Gets activities filtered by day');
  t.equal(activitiesTuesday.length, 1, 'Different activities for another day');
  t.equal(badCbId.length, 0, 'Bad cbId returns no activities');

  t.end();
});

test('Tests deleteActivity deletes an activity', async (t) => {
  await rebuild();

  const activitiesPreDelete = await activities(2);
  await deleteActivity(1, 2);
  const activitiesPostDelete = await activities(2);

  t.notDeepEqual(activitiesPreDelete, activitiesPostDelete);

  await rebuild();

  const badActivitiesPreDelete = await activities(2);
  try {
    await deleteActivity(1);
  } catch (e) {
    t.pass('Bad values rejected');
  }
  const badActivitiesPostDelete = await activities(2);
  t.deepEqual(badActivitiesPreDelete, badActivitiesPostDelete);

  t.end();
});

test('Tests insertActivity inserts an activity', async (t) => {
  await rebuild();

  const activitiesPreInsert = await activities(2);
  const newId = await insertActivity('Test', 2);
  const activitiesPostInsert = await activities(2);

  t.notEqual(
    activitiesPreInsert.length,
    activitiesPostInsert.length,
    'Inserted activity!',
  );
  t.equal(newId, 6, 'Query returns the id of the new activity');

  try {
    await insertActivity('', 2);
    t.fail('Worked with no name');
  } catch (e) {
    t.pass('Bad name rejected');
  }

  try {
    await insertActivity('blah', null);
    t.fail('Worked with no cb id');
  } catch (e) {
    t.pass('No CB rejected');
  }

  try {
    await insertActivity(null, null);
  } catch (e) {
    t.pass('Bad values rejected');
  }

  t.end();
});

test('Tests updateAcivity updates an activity', async (t) => {
  await rebuild();

  const activitiesPreUpdate = await activities(2);
  await updateActivity(1, true, true, true, true, true, true, true, 2);
  const activitiesPostUpdate = await activities(2);

  t.notDeepEqual(activitiesPreUpdate, activitiesPostUpdate, 'Updated activity');

  try {
    await updateActivity(null, true, true, true, true, true, true, true, null);
    t.fail('Worked with bad inputs');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  try {
    await updateActivity(1, 'blah', true, true, true, true, true, true, 2);
    t.fail('Worked with bad inputs');
  } catch (e) {
    t.pass('Bad values rejected');
  }

  t.equal(1, 1);
  t.end();
});
