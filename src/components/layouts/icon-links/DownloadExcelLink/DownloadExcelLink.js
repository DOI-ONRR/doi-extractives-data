import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './DownloadExcelLink.module.scss'

import DownloadExcelIcon from '-!svg-react-loader!../../../../img/svg/icon-download-xls.svg'

const DownloadExcelLink = props => (
  <Link to={props.to} className={styles.root}>
    <DownloadExcelIcon />
    <span>
      {props.children === undefined
        ? 'Download'
        : props.children}
    </span>
  </Link>
)

DownloadExcelLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadExcelLink
