const initialState = {
  glossaryTerm: '',
  glossaryOpen: false
}

// Define Action Types
const GLOSSARY_TERM_SELECTED = 'GLOSSARY_TERM_SELECTED'

// Define Action Creators
export const glossaryTermSelected = (term, doOpen = true) => ({ type: GLOSSARY_TERM_SELECTED, payload: term, openGlossary: doOpen })

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
  case GLOSSARY_TERM_SELECTED:
    return ({ ...state, glossaryTerm: payload, glossaryOpen: action.openGlossary })
  default:
    return state
  }
}
