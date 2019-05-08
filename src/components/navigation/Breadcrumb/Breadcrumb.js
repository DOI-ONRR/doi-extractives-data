import React from 'react'
import PropTypes from 'prop-types'

import styles from './Breadcrumb.module.scss'

import Link from '../../utils/temp-link'

const Breadcrumb = ({crumbs}) => {
	return (
    <div className={styles.root}>
      {crumbs &&
        crumbs.map((crumb, index) => {
          let name = crumb.name;
          if (index > 0) {
            name = " "+name;
          }
          return (
            <React.Fragment key={index}>
              <Link to={crumb.to}>{name}</Link><span>{" /"}</span>
            </React.Fragment>
          );
        })
      }
    </div>
	)
}

Breadcrumb.propTypes = {
  /** Array of the links to display as the breadcrumb **/
  crumbs: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string,
        name: PropTypes.string
      })
    ).isRequired,
}

export default Breadcrumb