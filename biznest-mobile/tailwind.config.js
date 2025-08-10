const fonts = require('./constants/fonts').default;
const colors = require('./constants/colors').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './feature/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        roboto400: fonts.Roboto400,
        roboto500: fonts.Roboto500,
        roboto600: fonts.Roboto600,
        roboto700: fonts.Roboto700,
      },
      colors: colors,
    },
  },
  plugins: [],
};
