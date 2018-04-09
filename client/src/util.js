import { curry } from 'ramda';


export const renameKeys = curry((keyMap, obj) => // eslint-disable-line import/prefer-default-export
  Object
    .keys(obj)
    .reduce((acc, key) => {
      acc[keyMap[key] || key] = obj[key];
      return acc;
    }, {}));
