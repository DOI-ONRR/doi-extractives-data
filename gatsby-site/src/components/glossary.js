import React from 'react';

class GlossaryItem extends React.Component {

  state = {
      toggle: this.props.toggle || false
    };

  onClickHandler(e) {
    e.stopPropagation();
    this.setState({toggle:!this.state.toggle});
  }
  
  render() {
    return(
      <li className="glossary-item" data-accordion-item aria-expanded={this.state.toggle} onClick={this.onClickHandler.bind(this)}>
        <h2 className="glossary-term">{this.props.term.name}</h2>
        <button data-accordion-button role="button" aria-controls="glossary-accordion--content--2" ><span className="sr-only">Toggle for {this.props.term.name}</span></button>
        <p data-accordion-content className="glossary-definition accordion-content" aria-hidden={!this.state.toggle}>{this.props.term.definition}</p>
      </li>
    );
  }
}

const Glossary = ({terms}) => {
  return (
    <div id="glossary" className="drawer"
          aria-describedby="glossary-result" aria-hidden="false">
      <div className="container">
        <button id="glossary-toggle" className="button button--close toggle">
          <label htmlFor="glossary-toggle" className="sr-only">Close glossary</label><icon className="icon-close-x"></icon>
        </button>
      </div>

      <h1 className="h2 drawer-header"><icon className="icon-book"></icon> Glossary </h1>
      <label htmlFor="drawer-search-bar" className="label">Filter glossary terms</label>
      <input id="drawer-search-bar" className="js-glossary-search drawer-search" type="search" placeholder="e.g. Fossil fuel" />
      <div id="glossary-result">
        <ul className="js-glossary-list list-unstyled" data-accordion="glossary-accordion">
          {terms.map((term, index) => (
            <GlossaryItem key={index} term={term.node} />
          ))}
        </ul>
      </div>
    </div>
  );
} 

export default Glossary;
