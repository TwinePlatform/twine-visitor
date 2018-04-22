const moment = require('moment');
const { assoc, curry, reduce, keys } = require('ramda');

const ageRange = ageString =>
  ageString
    .replace('+', '')
    .split('-')
    .map(x => moment().year() - x)
    .reverse();

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);
module.exports = { ageRange, renameKeys };
