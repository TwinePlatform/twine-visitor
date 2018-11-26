import { curry, mergeDeepRight } from 'ramda';
import { ErrorUtils } from './api';


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

/**
 * Utility function to support client-side redirects based on
 * common status codes
 *
 * Allows passing custom redirects to override defaults
 */
export const redirectOnError = (historyPush, error, custom = {}) => {
  const defaults = {
    400: '/error/400',
    401: '/cb/login',
    403: '/cb/login',
    404: '/error/404',
    500: '/error/500',
    default: '/error/unknown',
  };

  const redirs = mergeDeepRight(defaults, custom);

  if (ErrorUtils.errorStatusEquals(error, 400)) {
    historyPush(redirs[400]);

  } else if (ErrorUtils.errorStatusEquals(error, 401)) {
    historyPush(redirs[401]);

  } else if (ErrorUtils.errorStatusEquals(error, 403)) {
    historyPush(redirs[403]);

  } else if (ErrorUtils.errorStatusEquals(error, 500)) {
    historyPush(redirs[500]);

  } else if (ErrorUtils.errorStatusEquals(error, 404)) {
    historyPush(redirs[404]);

  } else {
    historyPush(redirs.default);
  }
};
