import Typography from 'typography';
import bootstrapTheme from 'typography-theme-bootstrap';
import customTheme from './theme';

const typography = new Typography({
  ...bootstrapTheme,
  ...customTheme.typography,
});

export default typography;
