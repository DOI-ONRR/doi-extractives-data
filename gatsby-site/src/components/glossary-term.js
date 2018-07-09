import React from 'react';

const GlossaryTerm = (props) => (
  <span className="term term-end" data-term={props.dataTerm ? props.dataTerm : props.children} title="Click to define" tabindex="0">
    {props.children}
    <icon className="icon-book"></icon>
  </span>
);

export default GlossaryTerm;