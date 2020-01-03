import React from 'react'

import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { navigate } from '@reach/router'
import styles from './Tabordion.module.scss'

class Tabordion extends React.Component {
  constructor (props) {
    super(props)
    let selected = this.props.selected || ''
    let selectedIndex = 0
    if (this.props.children && selected) {
	    selectedIndex = this.props.children.findIndex(child => child.props.id === selected)
	    if (selectedIndex === -1) {
        selectedIndex = 0
      }
    }
    this.state = {
	    tabId: this.props.children && this.props.children[selectedIndex].props.id,
	    tabPanel: this.props.children && this.props.children[selectedIndex].props.children,
    }
  }

  tabClicked (id, content, element) {
    if (this.state.tabId !== id) {
      this.setState({ tabId: id, tabPanel: content })
      navigate('?tab=' + id)
    }
  }

  render () {
    return (
      <div>
        <MediaQuery minWidth={81}>
          <div className={styles.root + ' container-page-wrapper'}>
            <div className={styles.tabContainer}>
              {this.props.children &&
							React.Children.map(this.props.children, (child, index) => {
							    return <Tab index={index} key={index} isSelected={(this.state.tabId === child.props.id)} callBack={this.tabClicked.bind(this)} {...child.props} />
							})
              }
            </div>
            <div className={styles.tabPanelContainer}>
              {this.state.tabPanel}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={80}>
          <div className={styles.root + ' container-page-wrapper'}>
            <div className={styles.tabContainer}>
              {this.props.children &&
							React.Children.map(this.props.children, (child, index) => {
							  let isSelected = (this.state.tabId === child.props.id)

							  if (isSelected) {
							    return (
							      <div style={{ width: '100%' }}>
							        <Tab key={index}
							          isAccordion={true}
							          isSelected={(this.state.tabId === child.props.id)}
							          callBack={this.tabClicked.bind(this)} {...child.props} />
							        <div className={styles.tabPanelContainer + ' ' + styles.accordionPanelContainer}>
							          {this.state.tabPanel}
							        </div>
							      </div>
							    )
							  }
							  else {
							    return <Tab key={index}
							      isAccordion={true}
							      isSelected={(this.state.tabId === child.props.id)}
							      callBack={this.tabClicked.bind(this)} {...child.props} />
							  }
							})
              }

            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }
};

export class Tab extends React.Component {
  componentDidMount () {
    if (this.props.isSelected && this.props.isAccordion) {
      window.scrollTo(0, this.node.offsetTop - 5, { behavior: 'smooth' })
    }
  }

  render () {
    return (
		  <div id={this.props.id}
        // eslint-disable-next-line no-return-assign
        ref={node => this.node = node}
        className={this.props.isSelected ? styles.tabSelected + ' ' + styles.tab : styles.tab}
        onClick={() => this.props.callBack(this.props.id, this.props.children)}
        onKeyUp={event => {
          if (event.keyCode === 13) {
            this.props.callBack(this.props.id, this.props.children)
          }
        }}
        tabIndex={0}
	    >
        {(this.props.name || 'Tab')}
		  </div>
    )
  }
}

Tab.propTypes = {
	 /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
}

Tabordion.propTypes = {

}

export default Tabordion
