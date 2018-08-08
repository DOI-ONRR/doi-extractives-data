import React from 'react';
import PropTypes from 'prop-types';

import ColorSwatch from '../color-swatch';
import styles from './styles.module.scss';

const ColorDirectory = ({ variants }) => (
  <div className={styles.colorDirectory}>
    {
      variants.map(color => (
        <ColorSwatch
          key={color.className}
          cssClass={color.className}
          name={color.colorName}
          code={color.colorCode}
          isAccessible={color.accessible}
        />
      ))
    }
  </div>
);

ColorDirectory.propTypes = {
  pathContext: PropTypes.shape({
    variants: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      context: PropTypes.shape({
        className: PropTypes.string,
        colorName: PropTypes.string,
        colorCode: PropTypes.string,
        accessible: PropTypes.bool,
      }),
    })),
  })
};

ColorDirectory.defaultProps = {
  // TODO Not sure where to put these and how to get graphQL to find them
  variants: [{
    className: 'bg-green',
    colorName: 'green',
    colorCode: '#587f4c',
    accessible: true,
  }],
};


export default ColorDirectory;
