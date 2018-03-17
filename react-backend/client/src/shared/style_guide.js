/*
 * Style guide
 */

export const colors = {
  highlight_primary: '#FDBD2D',
  highlight_secondary: '#833FF7',
  darker: '#424242',
  dark: '#666666',
  light: '#DBDBDB',
  lighter: '#FFFFFF',
  background: '#FFFFFF',
};


export const fonts = {
  family: {
    default: 'Nunito, sans-serif',
    highlight: 'Nunito, sans-serif',
  },
  size: {
    base: '1em',
    heading: '2em',
    heading2: '1.5em',
    small: '0.75em',
  },
  weight: {
    base: '400',
    light: '300',
    medium: '700',
    heavy: '800',
  },
};


export const layout = {};


export default {
  colors,
  fonts,
  layout,
  fontFamily: fonts.family,
  fontSize: fonts.size,
  fontWeight: fonts.weight,
};
