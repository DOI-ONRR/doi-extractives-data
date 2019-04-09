import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './DownloadDataLink.module.scss'

import DownloadDataIcon from '-!svg-react-loader!../../../../img/svg/icon-download-buttonup.svg'

const DownloadDataLink = props => (
  <Link to={props.to} className={styles.root}>
    <DownloadDataIcon />
    <span>
        	{props.children === undefined
        ? 'Download data'
        : props.children}
    </span>
  </Link>
)

DownloadDataLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadDataLink
