import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { navigate } from '@reach/router'

import { withStyles } from '@material-ui/core/styles'
// import styles from "./Tabordion.module.scss"

const styles = theme => ({
  tabContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    zIndex: '10'
  },
  tab: {
    backgroundColor: theme.palette.grey[50],
    marginLeft: theme.spacing(1),
    borderTop: `0px solid ${ theme.palette.grey[50] }`,
    borderRight: `0px solid ${ theme.palette.grey[50] }`,
    borderLeft: `0px solid ${ theme.palette.grey[50] }`,
    borderBottom: `0px solid ${ theme.palette.grey[50] }`,
    color: theme.palette.text,
    cursor: 'pointer',
    fontSize: theme.palette.fontSize,
    fontWeight: '200',
    overflow: 'hidden',
    padding: '10px 20px',
    textAlign: 'center',
    cssFloat: 'left'
  },
  'tab:hover': {
    textDecoration: 'underline'
  },
  tabSelected: {
    backgroundColor: 'white',
    borderTop: `5px solid ${ theme.palette.grey[500] }`,
    borderLeft: `1px solid ${ theme.palette.grey[50] }`,
    borderRight: `1px solid ${ theme.palette.grey[50] }`,
    borderBottom: 'none',
    paddingTop: '6px',
    fontWeight: 'bold',
    zIndex: '20',
    outline: 'none',
    ':last-of-type': {
      borderRight: `1px solid --${ theme.palette.grey[50] }`
    }
  },
  tabPanelContainer: {
    backgroundColor: 'white',
    borderTop: `1px solid ${ theme.palette.grey[500] }`,
    overflow: 'hidden',
    position: 'relative',
    top: '-1px',
    zIndex: '0'
  },
  accordionPanelContainer: {
    animation: 'expand 0.25s',
    transformOrigin: 'top center',
    animationTimingFunction: 'ease-out'
  },
  '@keyframes expand': {
    '0%': {
      transform: 'scaleY(0.75)'
    },
    '100%': {
      transform: 'scaleY(1)'
    }
  },
  '@media screen and (max-width: 481px)': {
    'tabContainer': {
      flexWrap: 'wrap',
      paddingRight: '0',
      width: '100%',
      marginLeft: '0px'
    },
    'tab': {
      border: `1px solid ${ theme.palette.grey[50] }`,
      cssFloat: 'none',
      textAlign: 'left',
      width: '100%',
      marginLeft: '0px'
    },
    'tab:not(:last-of-type)': {
      borderBottom: '0px'
    },
    'tabSelected': {
      borderTop: '5px solid',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none'
    },
    'tabPanelContainer': {
      borderTop: 'none',
      top: '0px'
    }
  }
})

class Tabordion extends React.Component {
  constructor(props) {
    super(props)
    let selected = this.props.selected || ''
    let selectedIndex = 0
    if (this.props.children && selected) {
      selectedIndex = this.props.children.findIndex(
        child => child.props.id == selected
      )
      if (selectedIndex == -1) {
        selectedIndex = 0
      }
    }
    this.state = {
      tabId: this.props.children && this.props.children[selectedIndex].props.id,
      tabPanel:
        this.props.children && this.props.children[selectedIndex].props.children
    }
  }

  tabClicked(id, content, element) {
    if (this.state.tabId !== id) {
      this.setState({ tabId: id, tabPanel: content })
      navigate('?tab=' + id)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <MediaQuery minWidth={81}>
          <div className={classes.tabContainer}>
            {this.props.children &&
              React.Children.map(this.props.children, (child, index) => {
                return (
                  <Tab
                    index={index}
                    key={index}
                    isSelected={this.state.tabId === child.props.id}
                    callBack={this.tabClicked.bind(this)}
                    classes={classes}
                    {...child.props}
                  />
                )
              })}
          </div>
          <div className={classes.tabPanelContainer}>
            {this.state.tabPanel}
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={80}>
          <div className={classes.tabContainer}>
            {this.props.children &&
                React.Children.map(this.props.children, (child, index) => {
                  let isSelected = this.state.tabId === child.props.id

                  if (isSelected) {
                    return (
                      <div style={{ width: '100%' }}>
                        <Tab
                          key={index}
                          isAccordion={true}
                          isSelected={this.state.tabId === child.props.id}
                          callBack={this.tabClicked.bind(this)}
                          {...child.props}
                        />
                        <div
                          className={
                            classes.tabPanelContainer +
                            ' ' +
                            classes.accordionPanelContainer
                          }
                        >
                          {this.state.tabPanel}
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <Tab
                        key={index}
                        isAccordion={true}
                        isSelected={this.state.tabId === child.props.id}
                        callBack={this.tabClicked.bind(this)}
                        {...child.props}
                      />
                    )
                  }
                })}
          </div>
        </MediaQuery>
      </Fragment>
    )
  }
}

export class Tab extends React.Component {
  componentDidMount() {
    if (this.props.isSelected && this.props.isAccordion) {
      window.scrollTo(0, this.node.offsetTop - 5, { behavior: 'smooth' })
    }
  }

  render() {
    let classes = this.props.classes
    return (
      <div
        id={this.props.id}
        // eslint-disable-next-line no-return-assign
        ref={node => (this.node = node)}
        className={
          this.props.isSelected
            ? classes.tabSelected + ' ' + classes.tab
            : classes.tab
        }
        onClick={() => this.props.callBack(this.props.id, this.props.children)}
        onKeyUp={event => {
          console.debug(event)
          if (event.keyCode == 13) {
            this.props.callBack(this.props.id, this.props.children)
          }
        }}
        tabIndex={0}
      >
        {this.props.name || 'Tabsdss'}
      </div>
    )
  }
}

Tab.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  // classes: PropTypes.object.isRequired
}

Tabordion.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Tabordion)
