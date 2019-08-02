import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'
import styles from './DataArchiveLink.module.scss'
import DataArchiveIcon from '-!svg-react-loader!../../../../img/svg/icon-archive.svg'

const DataArchiveLink = props => (
  <Link to={props.to} className={styles.root}>
    <DataArchiveIcon />
    <span>
      {props.children === undefined
        ? 'Data archive'
        : props.children}
    </span>
  </Link>
)

DataArchiveLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DataArchiveLink
