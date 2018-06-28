/**
 * Basic theme
 */

const palette = {
  primary: {
    contrast: 'white',
    main: 'linear-gradient(to right, #4568dc, #b06ab3)',
  },
  secondary: {
    contrast: 'grey',
    main: '#242424',
    dark: '#181818',
  },
};

const baseSize = 18;

const typography = {
  baseFontSize: `${baseSize}px`,
};

const zIndex = {
  header: 10,
  overlay: 15,
  drawer: 20,
  headerText: 25,
};

export default {
  palette,
  typography,
  zIndex,
  size: size => `${size * baseSize}px`,
};
