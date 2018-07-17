import React from 'react';
import { connect } from 'react-redux';
import lazy from 'lazy.js';
import { glossaryTermSelected as glossaryTermSelectedAction } from 'state/app';

import GLOSSARY_TERMS from 'data/terms.yml';

class GlossaryItem extends React.Component {

  state = {
      toggle: false
    };

  onClickHandler(e) {
    e.stopPropagation();
    this.setState({toggle:!this.state.toggle});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.toggle !== this.state.toggle) {
      this.setState({toggle: nextProps.toggle});
    }
  }
  
  render() {
    return(
      <li className="glossary-click glossary-item" data-accordion-item aria-expanded={this.state.toggle} onClick={this.onClickHandler.bind(this)}>
        <h2 className="glossary-click glossary-term">{this.props.term.name}</h2>
        <button className="glossary-click" data-accordion-button role="button" aria-controls="glossary-accordion--content--2" ><span className="glossary-click sr-only">Toggle for {this.props.term.name}</span></button>
        <p data-accordion-content className="glossary-click glossary-definition accordion-content" aria-hidden={!this.state.toggle}>{this.props.term.definition}</p>
      </li>
    );
  }
}

class Glossary extends React.Component {  

  state = {
    glossaryTerm: this.props.glossaryTerm || "",
    toggleHidden: true
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.glossaryTerm !== this.state.value) {
      this.setState({glossaryTerm: nextProps.glossaryTerm, toggleHidden: !nextProps.glossaryOpen});
    }
  }

  handleChange(event) {
    this.setState({glossaryTerm: event.target.value});
  }

  filterTerms(){
    let self = this;
    return (lazy(GLOSSARY_TERMS)
      .filter(function(term){return lazy(term.name.toLowerCase()).contains(self.state.glossaryTerm.toLowerCase());})
      .toArray());
  }

  escHandler(event){
    if(event.keyCode === 27 && !this.state.toggleHidden) {
      this.onCloseHandler();
    }
  }

  clickHandler(event) {
    let target = event.target;
    if(!this.state.toggleHidden && target.classList.value !== "") {
      
      if (!lazy(target.classList.value).contains('glossary-click')) {
        this.onCloseHandler();
      }
    }
  }

  onCloseHandler(){
    this.props.glossaryTermSelected("", false);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escHandler.bind(this), false);
    document.addEventListener("click", this.clickHandler.bind(this), true);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escHandler.bind(this), false);
    document.removeEventListener("click", this.clickHandler.bind(this), true);
  }

  render() {    
    let filteredTerms = this.filterTerms()
    return (
      <div id="glossary" className="drawer glossary-click" aria-describedby="glossary-result" aria-hidden={this.state.toggleHidden}>
        <div className="glossary-click container">
          <button id="glossary-toggle" className=" glossary-click button button--close toggle" onClick={this.onCloseHandler.bind(this)}>
            <label htmlFor="glossary-toggle" className="glossary-click sr-only">Close glossary</label><icon className="icon-close-x"></icon>
          </button>
        </div>

        <h1 className="h2 drawer-header glossary-click"><icon className="glossary-click icon-book"></icon> Glossary </h1>
        <label htmlFor="drawer-search-bar" className="glossary-click label">Filter glossary terms</label>
        <input id="drawer-search-bar" className="glossary-click js-glossary-search drawer-search" type="search" placeholder="e.g. Fossil fuel" 
          value={this.state.glossaryTerm} onChange={this.handleChange.bind(this)} />
        <div id="glossary-click glossary-result">
          <ul className="glossary-click js-glossary-list list-unstyled" data-accordion="glossary-accordion">
            {(filteredTerms).map((term, index) => (
              <GlossaryItem key={index} term={term} toggle={(filteredTerms.length === 1)}/>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
}

export default connect(
  state => ({ glossaryTerm: state.app.glossaryTerm, glossaryOpen: state.app.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) }),
)(Glossary);
