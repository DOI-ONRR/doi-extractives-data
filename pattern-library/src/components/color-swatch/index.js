import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const ColorSwatch = ({ cssClass, name, code, isAccessible }) => (
  <div className={styles.swatch}>
    <div className={`${styles.swatchColor} ${cssClass}`}></div>
    <div className={styles.labelPrimary}>{name}</div>
    <div className={styles.labelSecondary}>{code}</div>
    {
      isAccessible &&
        <div>
          <div className={styles.iconOk}></div>
          <div className={styles.labelSecondary}>Accessible</div>
        </div> ||
        <div>
          <div className={styles.iconNo}></div>
          <div className={styles.labelSecondary}>Not accessible</div>
        </div>
    }
  </div>
);

ColorSwatch.propTypes = {
  cssClass: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  isAccessible: PropTypes.bool,
};

ColorSwatch.defaultProps = {
  isAccessible: false,
};


export default ColorSwatch;
