import React from 'react';
import PropTypes from 'prop-types';

/**
 * The `<Button>` is a foundational trigger component for capturing
 * and guiding user-interaction.
 */
const Button = ({ variant, children }) => (
  <button className={`button-${variant}`}>{children}</button>
);

Button.propTypes = {
  /** The modifier name for the Button */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'disabled',
  ]),
};

Button.defaultProps = {
  variant: 'primary',
};

export default Button;
