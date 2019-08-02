import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './MapLink.module.scss'

import MapIcon from '-!svg-react-loader!../../../../img/svg/icon-us-map.svg'

const MapLink = props => (
  <Link to={props.to} className={styles.root}>
    <MapIcon />
    <span>
      ß{props.children === undefined
        ? 'Data by state'
        : props.children}
    </span>
  </Link>
)

MapLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default MapLink
