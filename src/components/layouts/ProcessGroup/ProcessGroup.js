import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'

import {portraitTabletBreakpointUp, portraitTabletBreakpointDown} from "../../../css-global/variables.scss"

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
		console.log(this.props);
		let stepId = this.props.stepId || this.props.stepid;
		let stepName = this.props.stepName || this.props.stepname;
	  return (
	    <div className={styles.processStepContainer}>
	      {stepId &&
					<div className={styles.processStepId}>{stepId}</div>
	      }
	      {stepName &&
					<span className={styles.processStepName}>{stepName}</span>
	      }
	      <MediaQuery maxWidth={portraitTabletBreakpointDown}>
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
	      <MediaQuery maxWidth={portraitTabletBreakpointDown}>
	        <div id="process-step-content" className={styles.processStepContent} aria-hidden={!this.state.expanded}>
	          {this.props.children}
	        </div>
	      </MediaQuery>
	      <MediaQuery minDeviceWidth={portraitTabletBreakpointUp}>
	        <div id="process-step-content" className={styles.processStepContent}>
	          {this.props.children}
	        </div>
	      </MediaQuery>
	    </div>
	  )
	}
}

ProcessStep.propTypes = {
	stepId: PropTypes.string,
	stepName: PropTypes.string,
  expanded: PropTypes.oneOfType([
						  PropTypes.string,
						  PropTypes.bool
  ])
}

ProcessStep.defaultProps = {
  expanded: false,
}
