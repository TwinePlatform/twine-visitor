import { toCancellable, pairs, ageOptsToParams } from '../util';


describe('Client utility functions', () => {
  describe('toCancellable', () => {
    test('toCancellable | not cancelled, resolves', () => {
      const p = new Promise(resolve => setTimeout(resolve, 0));
      const q = toCancellable(p);

      return q;
    });

    test('toCancellable | not cancelled, rejects', () => {
      expect.assertions(1);

      const p = new Promise((resolve, reject) => setTimeout(() => reject(Error('foo')), 0));
      const q = toCancellable(p);

      return q.catch((error) => {
        expect(error.message).toBe('foo');
      });
    });

    test('toCancellable | cancelled, resolves', (done) => {
      expect.assertions(3);

      const success = jest.fn();
      const error = jest.fn();

      const p = new Promise(resolve => setTimeout(resolve, 0));
      const q = toCancellable(p);

      q.then(success, error);
      q.cancel();

      setTimeout(() => {
        expect(success).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(q.isCancelled).toBe(true);
        done();
      }, 10);
    });

    test('toCancellable | cancelled, rejects', (done) => {
      expect.assertions(3);

      const success = jest.fn();
      const error = jest.fn();

      const p = new Promise((resolve, reject) => setTimeout(() => reject(Error('foo')), 0));
      const q = toCancellable(p);

      q.then(success, error);
      q.cancel();

      setTimeout(() => {
        expect(success).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(q.isCancelled).toBe(true);
        done();
      }, 10);
    });
  });

  describe('ageOptsToParams', () => {
    test('Empty string', () => {
      expect(ageOptsToParams('')).toEqual(undefined);
    });

    test('Upper and lower bound', () => {
      expect(ageOptsToParams('21-45')).toEqual([21, 45]);
    });
    test('Lower bound only', () => {
      expect(ageOptsToParams('-30')).toEqual(undefined);
    });

    test('Upper bound only', () => {
      expect(ageOptsToParams('35+')).toEqual([35, 999]);
    });
    test('Invalid string', () => {
      expect(ageOptsToParams('boo')).toEqual(undefined);
    });
  });

  describe('pairs', () => {
    test('Empty array', () => {
      expect(pairs([])).toEqual([]);
    });

    test('Even length array', () => {
      expect(pairs([1, 2])).toEqual([[1, 2]]);
      expect(pairs([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]);
      expect(pairs([1, 2, 3, 4, 5, 6])).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    test('Odd length array', () => {
      expect(pairs([1])).toEqual([[1]]);
      expect(pairs([1, 2, 3])).toEqual([[1, 2], [3]]);
      expect(pairs([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    });

    test('Non-array', () => {
      expect(() => pairs(1)).toThrow();
    });
  });
});
