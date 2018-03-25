import { toCancellable } from '../util';

describe('Client utility functions', () => {
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
