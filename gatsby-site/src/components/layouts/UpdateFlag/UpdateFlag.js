import React from 'react';
import PropTypes from 'prop-types';

import styles from "./UpdateFlag.module.scss";
import logo from "../../../img/us-flag-small.png";

const UpdateFlag = ({date}) => (
  <span className={styles.root}>Updated {date}</span>
);

UpdateFlag.propTypes = {
	 /** The date to display */
  date: PropTypes.string,
}

UpdateFlag.defaultProps = {
	date: 'recently',
}

export default UpdateFlag;