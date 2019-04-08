import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Sticky from 'react-stickynode'

import styles from './StickyWrapper.module.scss'

/***
 * This component wraps the react-stickynode implementation. If this library ever breaks or becomes obsolete
 * we can easily update this component with a new sticky implementation.
 */
const StickyWrapper = props => {
  let { children, ...rest } = { ...props }
  return (
    <Sticky {...rest}>
      {children}
    </Sticky>
  )
}

StickyWrapper.propTypes = {
  /** The offset from the top of document which release state will be triggered when the bottom of the element reaches at. If it is a selector to a target (via querySelector()), the offset will be the bottom of the target. */
  bottomBoundary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default StickyWrapper
