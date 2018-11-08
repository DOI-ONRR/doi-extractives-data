import React from 'react';
import { connect } from 'react-redux';
import { glossaryTermSelected as glossaryTermSelectedAction } from '../../state/reducers/glossary';

const GlossaryTerm = ({termKey, children, glossaryTermSelected, glossaryTerm}) => {

	const getTerm = () => {
		if(termKey){
			return termKey;
		}
		else if(Array.isArray(children)) {
			return children[0];
		}
		return children;
	}

	return (
		<span className="term term-end" title="Click to define" tabIndex="0" 
			onClick={() => glossaryTermSelected(getTerm())}>
			{children}
			<icon className="icon-book"></icon>
		</span>
	);
};

export default connect(
  state => ({ glossaryTerm: state.glossary.glossaryTerm }),
  dispatch => ({ glossaryTermSelected: term => dispatch(glossaryTermSelectedAction(term)) }),
)(GlossaryTerm);