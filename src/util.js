import { curry } from 'ramda';

/**
 * Takes an object describing a mapping between strings,
 * and transforms a given object's keys according to the map
 *
 * @example
 * renameKeys({ a: b }, { a: 1, c: 2 })
 * // returns { b: 1, c: 2 }
 *
 * @param   {Object} keyMap Keys you have -> keys you want
 * @param   {Object} obj    Object with keys to map
 * @returns {Object}        Object with keys you want
 */
export const renameKeys = curry((keyMap, obj) => // eslint-disable-line import/prefer-default-export
  Object
    .keys(obj)
    .reduce((acc, key) => {
      acc[keyMap[key] || key] = obj[key];
      return acc;
    }, {}));


/**
 * Decorates given promise with method to cancel resolution
 * of the promise.
 *
 * NOTE: Promises are _eager_, so this does not cancel the async
 * job the function is performing, it mergely prevents the promise
 * from ever resolving.
 * @param   {Promise} p Promise to make cancellable
 * @returns {Promise}   Cancellable promise
 */
export const toCancellable = (p) => {
  let hasCancelled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    p.then(
      (value) => {
        if (hasCancelled) {
          wrappedPromise.isCancelled = true;
          return null;
        }

        return resolve(value);
      },
      (error) => {
        if (hasCancelled) {
          wrappedPromise.isCancelled = true;
          return null;
        }

        return reject(error);
      },
    );
  });

  wrappedPromise.cancel = () => {
    hasCancelled = true;
  };

  return wrappedPromise;
};
