import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'

import styles from './ProcessGroup.module.scss'

class ProcessGroup extends React.Component {
  render () {
    return (
      <div className={styles.root}>
        {this.props.children}
		  </div>
    )
  }
}

export default ProcessGroup

export class ProcessStep extends React.Component {
	state = {
	  expanded: (typeof this.props.expanded === 'string') ? (this.props.expanded === 'true') : this.props.expanded,
	}

	handleClick () {
	  this.setState({ expanded: !this.state.expanded })
	}

	render () {
	  return (
	    <div className={styles.processStepContainer}>
	      {this.props.stepId &&
					<div className={styles.processStepId}>{this.props.stepId}</div>
	      }
	      {this.props.stepName &&
					<span className={styles.processStepName}>{this.props.stepName}</span>
	      }
	      <MediaQuery maxWidth={767}>
	        <button is="aria-toggle"
	          aria-controls="process-step-content"
	          aria-expanded={this.state.expanded}
	          type="button"
	          class={styles.toggleButton}
	          onClick={this.handleClick.bind(this)}>
	          {this.state.expanded
	            ? <icon className="icon icon-chevron-sm-down"></icon>
	            :							<icon className="icon icon-chevron-sm-up"></icon>
	          }
	        </button>
	      </MediaQuery>
	      <MediaQuery maxWidth={767}>
	        <div id="process-step-content" className={styles.processStepContent} aria-hidden={!this.state.expanded}>
	          {this.props.children}
	        </div>
	      </MediaQuery>
	      <MediaQuery minDeviceWidth={768}>
	        <div id="process-step-content" className={styles.processStepContent}>
	          {this.props.children}
	        </div>
	      </MediaQuery>
	    </div>
	  )
	}
}

ProcessStep.propTypes = {
  expanded: PropTypes.oneOfType([
						  PropTypes.string,
						  PropTypes.bool
  ])
}

ProcessStep.defaultProps = {
  expanded: false,
}
