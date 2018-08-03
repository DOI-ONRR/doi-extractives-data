const initialState = {
  glossaryTerm: "",
  glossaryOpen: false,
  defaultYear: 2017,
  yearScope: {year: 2017, scope: 'All'}
};

// Define Action Types
const GLOSSARY_TERM_SELECTED = 'GLOSSARY_TERM_SELECTED';
const YEAR_SELECTED = 'YEAR_SELECTED';

// Define Action Creators 
export const glossaryTermSelected = (term, doOpen=true) => ({ type: GLOSSARY_TERM_SELECTED, payload: term,  openGlossary: doOpen});
export const yearSelected = (year, scope) => ({ type: YEAR_SELECTED, payload: {'year': year, 'scope': scope}});

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload } = action;

  //console.log("Action: "+ type);
  //console.log("Action state: ", action);

  switch (type) {
    case GLOSSARY_TERM_SELECTED:
      return ({...state, glossaryTerm: payload, glossaryOpen: action.openGlossary});
    case YEAR_SELECTED:
      let yearScope = {}
      yearScope.year = (payload.year || initialState.defaultYear);
      yearScope.scope = payload.scope
      return ({...state, yearScope});
    default:
      return state;
  }

};
