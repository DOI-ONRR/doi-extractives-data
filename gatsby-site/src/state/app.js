const initialState = {
  glossaryTerm: undefined
};

// Define Action Types
const GLOSSARY_TERM_SELECTED = 'GLOSSARY_TERM_SELECTED';

// Define Action Creators 
export const glossaryTermSelected = term => ({ type: GLOSSARY_TERM_SELECTED, payload: term });

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload } = action;
  console.log("Action: "+ type);
  console.log("Action Payload: ", payload);
  switch (type) {
    case GLOSSARY_TERM_SELECTED:
      return {...state, glossaryTerm: payload}
    default:
      return state;
  }
};
