const moment = require('moment');
const { assoc, curry, reduce, keys } = require('ramda');

// ageString :: String -> [ Int ]
const ageRange = (ageString) =>
  ageString
    .replace('+', '')
    .split('-')
    .map((x) => moment().year() - x)
    .reverse();

// renameKeys :: {a: b} -> {a: *} -> {b: *}
const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

module.exports = { ageRange, renameKeys };
