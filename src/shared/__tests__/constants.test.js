import { BirthYear, AgeRange, Gender } from '../constants';


describe('Constants', () => {
  describe('BirthYear', () => {
    test('list | start > end | asc', () => {
      expect(BirthYear.list(1954, 1965, 'asc'))
        .toEqual([1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965]);
    });

    test('list | start > end | desc', () => {
      expect(BirthYear.list(1954, 1965))
        .toEqual([1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957, 1956, 1955, 1954]);
    });

    test('list | start < end', () => {
      expect(BirthYear.list(2018, 2000))
        .toEqual([]);
    });

    test('list | start = end', () => {
      expect(BirthYear.list(2018, 2018))
        .toEqual([2018]);
    });

    test('listToOptions | empty list', () => {
      expect(BirthYear.listToOptions([]))
        .toEqual([
          { key: '', value: '' },
        ]);
    });

    test('listToOptions | populated list', () => {
      expect(BirthYear.listToOptions([1985, 1988, 1933]))
        .toEqual([
          { key: '', value: '' },
          { key: '1985', value: '1985' },
          { key: '1988', value: '1988' },
          { key: '1933', value: '1933' },
        ]);
    });

    test('toAge | non-null', () => {
      expect(BirthYear.toAge(1985)).toBe(new Date().getFullYear() - 1985);
    });

    test('toAge | null', () => {
      expect(BirthYear.toAge(null)).toBe(null);
    });

    test('fromAge | number', () => {
      expect(BirthYear.fromAge(68)).toBe(new Date().getFullYear() - 68);
    });

    test('fromAge | prefer not to say', () => {
      expect(BirthYear.fromAge(null)).toBe(null);
    });

    test('toDisplay | non-null', () => {
      expect(BirthYear.toDisplay(1985)).toBe(1985);
    });

    test('toDisplay | null', () => {
      expect(BirthYear.toDisplay(null)).toBe('Prefer not to say');
    });

    test('fromDisplay | non-null', () => {
      expect(BirthYear.fromDisplay(1985)).toBe(1985);
    });

    test('fromDisplay | null', () => {
      expect(BirthYear.fromDisplay('Prefer not to say')).toBe(null);
    });

    test('compose(toDisplay, fromDisplay) <=> identity', () => {
      expect(BirthYear.toDisplay(BirthYear.fromDisplay(1923))).toEqual(1923);
      expect(BirthYear.toDisplay(BirthYear.fromDisplay(2003))).toEqual(2003);
      expect(BirthYear.toDisplay(BirthYear.fromDisplay(1243))).toEqual(1243);
      expect(BirthYear.toDisplay(BirthYear.fromDisplay(1888))).toEqual(1888);
      expect(BirthYear.toDisplay(BirthYear.fromDisplay('Prefer not to say'))).toEqual('Prefer not to say');
    });

    test('compose(toAge, fromAge) <=> identity', () => {
      expect(BirthYear.toAge(BirthYear.fromAge(68))).toEqual(68);
      expect(BirthYear.toAge(BirthYear.fromAge(19))).toEqual(19);
      expect(BirthYear.toAge(BirthYear.fromAge(0))).toEqual(0);
      expect(BirthYear.toAge(BirthYear.fromAge(2))).toEqual(2);
      expect(BirthYear.toAge(BirthYear.fromAge(null))).toEqual(null);
    });
  });

  describe('AgeRange', () => {
    test('fromStr | invalid range', () => {
      expect(() => AgeRange.fromStr('')).toThrow();
      expect(() => AgeRange.fromStr('-30')).toThrow();
      expect(() => AgeRange.fromStr('+30')).toThrow();
      expect(() => AgeRange.fromStr('-3-10')).toThrow();
    });

    test('fromStr | bounded range', () => {
      expect(AgeRange.fromStr('0-10')).toEqual([0, 10]);
      expect(AgeRange.fromStr('10-30')).toEqual([10, 30]);
      expect(AgeRange.fromStr('11-3')).toEqual([11, 3]);
    });

    test('fromStr | unbounded range', () => {
      expect(AgeRange.fromStr('3+')).toEqual([3, AgeRange.UPPER_LIMIT]);
      expect(AgeRange.fromStr('20+')).toEqual([20, AgeRange.UPPER_LIMIT]);
      expect(AgeRange.fromStr('100+')).toEqual([100, AgeRange.UPPER_LIMIT]);
    });

    test('toStr | bounded range', () => {
      expect(AgeRange.toStr([10, 20])).toBe('10-20');
      expect(AgeRange.toStr([0, 0])).toBe('0-0');
      expect(AgeRange.toStr([-1, 3])).toBe('-1-3');
    });

    test('toStr | unbounded range', () => {
      expect(AgeRange.toStr([10, AgeRange.UPPER_LIMIT])).toBe('10+');
      expect(AgeRange.toStr([0, Infinity])).toBe('0+');
    });

    test('toStr | invalid range', () => {
      expect(() => AgeRange.toStr([1])).toThrow();
    });

    test('compose(fromStr, toStr) <=> identity', () => {
      expect(AgeRange.fromStr(AgeRange.toStr([23, 45]))).toEqual([23, 45]);
      expect(AgeRange.fromStr(AgeRange.toStr([0, 11]))).toEqual([0, 11]);
      expect(AgeRange.fromStr(AgeRange.toStr([123, 432]))).toEqual([123, 432]);
      expect(AgeRange.fromStr(AgeRange.toStr([23, 1]))).toEqual([23, 1]);
    });

    test('compose(toStr, fromStr) <=> identity', () => {
      expect(AgeRange.toStr(AgeRange.fromStr('23-45'))).toEqual('23-45');
      expect(AgeRange.toStr(AgeRange.fromStr('0-11'))).toEqual('0-11');
      expect(AgeRange.toStr(AgeRange.fromStr('123-432'))).toEqual('123-432');
      expect(AgeRange.toStr(AgeRange.fromStr('23-1'))).toEqual('23-1');
    });
  });

  describe('Gender', () => {
    test('toDisplay | capitalises', () => {
      expect(Gender.toDisplay('male')).toBe('Male');
      expect(Gender.toDisplay('female')).toBe('Female');
      expect(Gender.toDisplay('prefer not to say')).toBe('Prefer not to say');
    });

    test('fromDisplay | de-capitalises', () => {
      expect(Gender.fromDisplay('Male')).toBe('male');
      expect(Gender.fromDisplay('Female')).toBe('female');
      expect(Gender.fromDisplay('Prefer not to say')).toBe('prefer not to say');
    });
  });
});
