import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../utils/temp-link'

import styles from './ExploreDataButton.module.scss'

import ExploreDataIcon from '-!svg-react-loader!../../../../img/icons/explore-data-square.svg'

const ExploreDataButton = props => (
  <Link to={props.to} className={styles.root}>
    <div><ExploreDataIcon /></div>
    <div>
        	{props.children === undefined
        ? 'Explore the data'
        : props.children}
    </div>
  </Link>
)

ExploreDataButton.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

ExploreDataButton.defaultProps = {
  to: '/explore',
}

export default ExploreDataButton
