import React from 'react'
import { connect } from 'react-redux'
import lazy from 'lazy.js'
import { glossaryTermSelected as glossaryTermSelectedAction } from '../../state/reducers/glossary'

import utils from '../../js/utils'

import GLOSSARY_TERMS from '../../data/terms.yml'

class GlossaryItem extends React.Component {
  state = {
    toggle: this.props.toggle || false,
    show: this.props.show || true,
  };

  onClickHandler (e) {
    e.stopPropagation()
    this.setState({ toggle: !this.state.toggle })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ toggle: nextProps.toggle, show: nextProps.term.show })
  }

  render () {
    return (
      <li className="glossary-click glossary-item" aria-hidden={!this.state.show} data-accordion-item aria-expanded={this.state.toggle} onClick={this.onClickHandler.bind(this)}>
        <h2 className="glossary-click glossary-term">{this.props.term.name}</h2>
        <button className="glossary-click" data-accordion-button role="button" aria-controls="glossary-accordion--content--2" ><span className="glossary-click sr-only">Toggle for {this.props.term.name}</span></button>
        <p data-accordion-content className="glossary-click glossary-definition accordion-content" aria-hidden={!this.state.toggle}>{this.props.term.definition}</p>
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
    let filteredTerms = filterGlossaryTerms(this.state.glossaryTerm)
    return (
      <div id="glossary" className="drawer glossary-click" aria-describedby="glossary-result" aria-hidden={this.state.toggleHidden}>
        <div className="glossary-click container">
          <button id="glossary-toggle" className=" glossary-click button button--close toggle" onClick={this.onCloseHandler.bind(this)}>
            <label htmlFor="glossary-toggle" className="glossary-click sr-only">Close glossary</label><div className="icon-close-x"></div>
          </button>
        </div>

        <h1 className="h2 drawer-header glossary-click"><div className="glossary-click icon-book"></div> Glossary </h1>
        <label htmlFor="drawer-search-bar" className="glossary-click label">Filter glossary terms</label>
        <input id="drawer-search-bar" className="glossary-click js-glossary-search drawer-search" type="search" placeholder="e.g. Fossil fuel"
          value={this.state.glossaryTerm} onChange={this.handleChange.bind(this)} />
        <div id="glossary-click glossary-result">
          <ul className="glossary-click js-glossary-list list-unstyled" data-accordion="glossary-accordion">
            {(filteredTerms.terms).map((term, index) => (
              <GlossaryItem key={index} term={term} toggle={(filteredTerms.toggle)}/>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

function filterGlossaryTerms (glossaryTerm) {
  let numOfTermsToShow = 0
  if (glossaryTerm !== undefined && glossaryTerm !== '') {
    GLOSSARY_TERMS.forEach(term => {
      term.show = false
      if (term.name.toLowerCase().includes(glossaryTerm.toLowerCase())) {
        term.show = true
        numOfTermsToShow++
      }
    })
  }
  else {
    GLOSSARY_TERMS.forEach(term => term.show = true)
  }
  return { terms: GLOSSARY_TERMS, toggle: (numOfTermsToShow === 1) }
}

export function filterTerms (glossaryTerm) {
  if (glossaryTerm !== undefined && glossaryTerm !== '') {
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
)(Glossary)
