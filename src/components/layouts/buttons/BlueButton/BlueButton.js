import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './BlueButton.module.scss'

const BlueButton = props => (
  <Link to={props.to} className={styles.root}>
    <div>
        	{props.children === undefined
        ? 'Explore the data'
        : props.children}
    </div>
  </Link>
)

BlueButton.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default BlueButton
