import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

import lazy from 'lazy.js'
import { glossaryTermSelected as glossaryTermSelectedAction } from '../../state/reducers/glossary'
import GlossaryIcon from '-!svg-react-loader!../../img/svg/icon-question-circle.svg'

import GLOSSARY_TERMS from '../../data/terms.yml'

import utils from '../../js/utils'

const styles = {
  root: {
    width: '100%',
    maxWidth: 360,
  },
  list: {
    width: 250,
  },
  nested: {
    paddingLeft: '20px',
  },
  iconQuestion: {
    width: '30px',
    height: '30px',
  }
}

class GlossaryItem extends React.Component {
  state = {
    toggle: this.props.toggle || false,
    show: this.props.term.show || true,
  };

  onClickHandler (e) {
    e.stopPropagation()
    this.setState({ toggle: !this.state.toggle })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ toggle: nextProps.toggle, show: nextProps.term.show })
  }

  render () {
    let termId = utils.formatToSlug(this.props.term.name)+'_glossary_term'
    return (
      <li
        className="glossary-click glossary-item"
        aria-hidden={!this.state.show}
        data-accordion-item aria-expanded={this.state.toggle}
        onClick={this.onClickHandler.bind(this)}>
        <h2 className="glossary-click glossary-term">{this.props.term.name}</h2>
        <button
          className="glossary-click"
          data-accordion-button role="button"
          aria-controls={termId}
          tabIndex={this.state.show && -1}><span className="glossary-click sr-only">Toggle for {this.props.term.name}</span></button>
        <p
          id={termId}
          data-accordion-content
          className="glossary-click glossary-definition accordion-content"
          aria-hidden={!this.state.toggle}
        >
          {this.props.term.definition}
        </p>
      </li>
    )
  }
}

class Glossary extends React.Component {
  state = {
    glossaryTerm: this.props.glossaryTerm || '',
    toggleHidden: true
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ glossaryTerm: nextProps.glossaryTerm, toggleHidden: !nextProps.glossaryOpen })
  }

  handleChange (event) {
    this.setState({ glossaryTerm: event.target.value })
  }

  escHandler (event) {
    if (event.keyCode === 27 && !this.state.toggleHidden) {
      this.onCloseHandler()
    }
  }

  clickHandler (event) {
    let target = event.target
    if (!this.state.toggleHidden && target.classList.value !== '') {
      if (!lazy(target.classList.value).contains('glossary-click')) {
        this.onCloseHandler()
      }
    }
  }

  onCloseHandler () {
    this.props.glossaryTermSelected('', false)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.escHandler.bind(this), false)
    document.addEventListener('click', this.clickHandler.bind(this), true)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escHandler.bind(this), false)
    document.removeEventListener('click', this.clickHandler.bind(this), true)
  }

  render () {
    const { classes } = this.props
    let filteredTerms = filterGlossaryTerms(this.state.glossaryTerm)
    return (
      <Drawer anchor="right" open={this.props.glossaryOpen} onClose={this.props.glossaryOpen}>
        <div className={classes.list}>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <h1 className="h2 drawer-header glossary-click"><GlossaryIcon className={classes.iconQuestion} /> Glossary </h1>
                <label htmlFor="drawer-search-bar" className="glossary-click label">Filter glossary terms</label>
                <input
                  id="drawer-search-bar"
                  title="Glossary Term Search"
                  className="glossary-click js-glossary-search drawer-search"
                  type="search"
                  placeholder="e.g. Fossil fuel"
                  value={this.state.glossaryTerm}
                  onChange={this.handleChange.bind(this)}
                  tabIndex={this.state.toggleHidden && -1} />
              </ListSubheader>
            }
            className={classes.root}
          >

            {(filteredTerms.terms).map((term, index) => (
              <React.Fragment>
                <ListItem button key={term.name}>
                  <ListItemText primary={term.name}/>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={term.description} />
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </div>
        
        {/* <div aria-describedby="glossary-result" aria-hidden={this.state.toggleHidden}>
          <div className="glossary-click container">
            <button
              id="glossary-toggle"
              className=" glossary-click button button--close toggle"
              onClick={this.onCloseHandler.bind(this)}
              tabIndex={this.state.toggleHidden && -1}>
              <label htmlFor="glossary-toggle" className="glossary-click sr-only">Close glossary</label><div className="icon-close-x"></div>
            </button>
          </div>

          <h1 className="h2 drawer-header glossary-click"><GlossaryIcon/> Glossary </h1>
          <label htmlFor="drawer-search-bar" className="glossary-click label">Filter glossary terms</label>
          <input
            id="drawer-search-bar"
            title="Glossary Term Search"
            className="glossary-click js-glossary-search drawer-search"
            type="search"
            placeholder="e.g. Fossil fuel"
            value={this.state.glossaryTerm}
            onChange={this.handleChange.bind(this)}
            tabIndex={this.state.toggleHidden && -1} />
          <div id="glossary-result">
            <ul className="glossary-click js-glossary-list list-unstyled" data-accordion="glossary-accordion">
              {(filteredTerms.terms).map((term, index) => (
                <GlossaryItem key={index} term={term} toggle={(filteredTerms.toggle)}/>
              ))}
            </ul>
          </div>
        </div> */}
      </Drawer>
    )
  }
}

function filterGlossaryTerms (glossaryTerm) {
  let numOfTermsToShow = 0
  if (glossaryTerm !== undefined && glossaryTerm !== null && glossaryTerm !== '') {
    GLOSSARY_TERMS.forEach(term => {
      term.show = false
      if (term.name.toLowerCase().includes(glossaryTerm.toLowerCase())) {
        term.show = true
        numOfTermsToShow++
      }
    })
  }
  else {
    // eslint-disable-next-line no-return-assign
    GLOSSARY_TERMS.forEach(term => term.show = true)
  }
  return { terms: GLOSSARY_TERMS, toggle: (numOfTermsToShow === 1) }
}

export function filterTerms (glossaryTerm) {
  if (glossaryTerm !== undefined && glossaryTerm !== null && glossaryTerm !== '') {
    return (lazy(GLOSSARY_TERMS)
      .filter(function (term) {
        return (term.name.toLowerCase() === glossaryTerm.toLowerCase())
      })
      .toArray())
  }
  else {
    return lazy(GLOSSARY_TERMS).toArray()
  }
}

export default connect(
  state => ({ glossaryTerm: state.glossary.glossaryTerm, glossaryOpen: state.glossary.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) })
)(withStyles(styles)(Glossary))
