/*
 * Simple storage API
 *
 * Allows substituting browser-only APIs (localStorage)
 * with a mock version for testing
 */
import { TESTING } from '../../../config';

const dummyStore = {};

export default {
  get: key =>
    (process.env.NODE_ENV === TESTING
      ? dummyStore[key]
      : localStorage.getItem(key)),

  set: (key, value) => {
    if (process.env.NODE_ENV === TESTING) {
      dummyStore[key] = value;
    } else {
      localStorage.setItem(key, value);
    }
  },
};
