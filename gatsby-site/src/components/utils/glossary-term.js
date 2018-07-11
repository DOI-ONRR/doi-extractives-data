import React from 'react';
import { connect } from 'react-redux';
import { glossaryTermSelected as glossaryTermSelectedAction } from 'state/app';

const GlossaryTerm = ({termKey, children, glossaryTermSelected, glossaryTerm}) => (
  <span className="term term-end" title="Click to define" tabIndex="0" 
    onClick={() => glossaryTermSelected((termKey ? termKey : children))}>
    {children}
    <icon className="icon-book"></icon>
  </span>
);

export default connect(
  state => ({ glossaryTerm: state.app.glossaryTerm }),
  dispatch => ({ glossaryTermSelected: term => dispatch(glossaryTermSelectedAction(term)) }),
)(GlossaryTerm);