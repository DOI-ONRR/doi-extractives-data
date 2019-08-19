import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './DownloadLink.module.scss'

import DownloadIcon from '-!svg-react-loader!../../../../img/svg/icon-download.svg'

const DownloadLink = props => (
  <Link to={props.to} className={styles.root}>
    <DownloadIcon />
    <span>
      {props.children === undefined
        ? 'Download'
        : props.children}
    </span>
  </Link>
)

DownloadLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadLink
