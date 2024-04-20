const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      black: colors.black,
      transparent: colors.transparent,
      primary: "#ffffff",
      secondary: "#e8e8e8",
      tertiary: "#6db33f",
      accent: {
        primary: "#606970",
        secondary: "#c724b1",
        hover: "#e87fda"
      },
      text: {
        primary: "#eceaea"
      }
    },
    extend: {},
  },
  plugins: [],
}
