import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const ColorSwatch = ({ cssClass, name, code, isAccessible }) => (
  <div className={styles.swatch}>
    <div className={`${styles.swatchColor} ${cssClass}`}></div>
    <div className="label-primary">{name}</div>
    <div className="label-secondary">{code}</div>
    {
      isAccessible &&
        <div>
          <div className={styles.iconOk}></div>
          <div className="label-secondary">Accessible</div>
        </div> ||
        <div>
          <div className={styles.iconNo}></div>
          <div className="label-secondary">Not accessible</div>
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
