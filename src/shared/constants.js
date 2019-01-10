/*
 * Utility methods to perform common ops with constant values like:
 *  - Birth year
 *  - Gender
 *  - Disability
 *  - Etc
 */
import moment from 'moment';


const capitaliseFirstWord = s => s.replace(/^\w/, str => str.toUpperCase());

export const BirthYear = {
  // list :: (Number, Number, ['desc' | 'asc']) -> [Number]
  list: (start, end, order = 'desc') =>
    Array.from({ length: (end + 1) - start }, (v, i) => (order === 'desc') ? end - i : start + i),

  // listToOptions :: (Number) -> [{ key: string, value: string }]
  listToOptions: years =>
    [
      { key: '', value: '' },
      { key: 'prefer not to say', value: 'prefer not to say' },
    ]
      .concat(
        years.map(y => ({ key: String(y), value: String(y) })),
      ),

  // defaultOptionsList :: () -> [{ key: string, value: string }]
  defaultOptionsList: () =>
    BirthYear.listToOptions(
      BirthYear.list(new Date().getFullYear() - 113, new Date().getFullYear()),
    ),

  // toAge :: Number | null -> Number | null
  toAge: year =>
    year === null ? null : moment().year() - year,

  // fromAge :: Number | null -> Number | null
  fromAge: age =>
    age === null ? null : moment().year() - age,

  // toDisplay :: Number | null -> String
  toDisplay: year =>
    year === null ? 'Prefer not to say' : year,

  // fromDisplay :: String -> Number | null
  fromDisplay: year =>
    year === 'Prefer not to say' ? null : year,
};

export const AgeRange = {
  UPPER_LIMIT: 999,

  // fromStr :: String -> [Number, Number]
  fromStr: (str) => {
    if (!/^(\d{1,3}-\d{1,3}|\d{1,3}\+)$/.test(str)) {
      throw new Error(`Invalid age range: ${str}`);
    }

    const x = str
      .split(/[-+]/)
      .map(d => parseInt(d, 10))
      .filter(d => !isNaN(d))
      .concat(AgeRange.UPPER_LIMIT)
      .slice(0, 2);

    if (x.length !== 2) {
      throw new Error(`Invalid age range: ${str}`);
    }

    return x;
  },

  // toStr :: [Number, Number] -> String
  toStr: ([min, max]) => {
    if (typeof min === 'undefined' || typeof max === 'undefined') {
      throw new Error(`Invalid age range: [${[min, max]}]`);
    }

    return (max && max >= AgeRange.UPPER_LIMIT)
      ? `${min}+`
      : `${min}-${max}`;
  },
};

export const Gender = {
  // toDisplay :: String -> String
  toDisplay: capitaliseFirstWord,

  // fromDisplay :: String -> String
  fromDisplay: s => s.toLowerCase(),
};
