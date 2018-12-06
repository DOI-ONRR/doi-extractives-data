import Typography from 'typography'
require('typeface-patua-one')
require('typeface-lato')

const typography = new Typography({
  baseFontSize: "20px",
  baseLineHeight: 1.45,
  headerFontFamily: [
    "Patua One",
    "Georgia",
    "serif",
  ],
  bodyFontFamily: ["Lato", "sans-serif"],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
