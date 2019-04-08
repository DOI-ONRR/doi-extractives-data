import React from 'react'
import PropTypes from 'prop-types'

import styles from './DidYouKnow.module.scss'

import MoreIcon from '-!svg-react-loader!../../../img/icons/icon-plus.svg'
import LessIcon from '-!svg-react-loader!../../../img/icons/icon-min.svg'
import BullhornIcon from '-!svg-react-loader!../../../img/svg/icon-bullhorn.svg'

class DidYouKnow extends React.Component {
	state = {
	  expanded: false,
	}

	handleClick () {
	  this.setState({ expanded: !this.state.expanded })
	}

	render () {
	  let headingColorStyle = (this.props.color === 'red') ? styles.headingRed : styles.headingBlue
	  return (
	    <div class={styles.root}
	      is="aria-toggle"
	      aria-expanded={this.state.expanded} >
	      <h2 id="did-you-know-label" className={headingColorStyle + ' ' + styles.heading} >Did you know?</h2>
	      <p className={styles.content} >
	        {this.props.intro}
	      </p>
	      <div
	        id="did-you-know-expanded"
	        className={styles.contentExpanded}
	        aria-labelledby="did-you-know-label"
	        aria-hidden={!this.state.expanded}>
	        {this.props.children}
	      </div>
	      <div className={styles.toggleContainer}>
	        <button id='did-you-know-toggle'
	          is="aria-toggle"
	          aria-controls="did-you-know-expanded"
	          aria-expanded={this.state.expanded}
	          type="button"
	          class={styles.toggleButton}
	          onClick={this.handleClick.bind(this)}>
	          {this.state.expanded
	            ? <span>less <LessIcon /></span>
	            :											<span>more <MoreIcon /></span>
	          }
	        </button>
	      </div>
	    </div>
	  )
	}
}

DidYouKnow.propTypes = {
  /** The color of the heading. */
  color: PropTypes.string,
  /* Intro text that is always shown */
  intro: PropTypes.string,
}

DidYouKnow.defaultProps = {
  color: 'red',
}

export default DidYouKnow
