import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TextField from '@material-ui/core/TextField'

import lazy from 'lazy.js'
import { glossaryTermSelected as glossaryTermSelectedAction } from '../../../state/reducers/glossary'
import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'

import GLOSSARY_TERMS from '../../../data/terms.yml'

import utils from '../../../js/utils'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  glossaryIcon: {
    width: '30px',
    height: '30px',
    display: 'inline',
    position: 'relative',
    top: theme.spacing(0.5),
    marginRight: theme.spacing(1)
  },
  glossarySearchContainer: {
    padding: theme.spacing(2)
  },
  glossaryTextField: {

  }
}))

const GlossaryDrawer = props => {
  console.log('props: ', props)
  const classes = useStyles()
  const [state, setState] = useState({
    right: false,
    glossaryTerm: props.glossaryTerm || '',
    toggleHidden: true,
    showTerm: true
  })

  let filteredTerms = filterGlossaryTerms(state.glossaryTerm)

  console.log('filteredTerms: ', filteredTerms)

  const handleClickAway = () => {
    setState({ ...state, right: false })
  }

  const handleChange = event => {
    setState({ ...state, glossaryTerm: event.target.value })
  }

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, [side]: open })
  }

  const glossaryList = side => (
    <div
      className={classes.list}
      role="presentation"
    >
      <div className={classes.glossarySearchContainer}>
        <Typography variant="h4"><GlossaryIcon className={classes.glossaryIcon} />Glossary</Typography>
        <TextField
          id="outlined-basic"
          className={classes.glossaryTextField}
          label="Filter glossary terms"
          margin="normal"
          variant="outlined"
          placeholder="e.g. Fossil fuel"
          value={state.glossaryTerm}
          onChange={handleChange}
          tabIndex={state.toggleHidden && -1}
        />
      </div>
      
      {(filteredTerms.terms).map((term, index) => (
        <div key={index} aria-hidden={term.show} style={{ display: term.show ? 'block' : 'none' }}>
          <ExpansionPanel term={term.name}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{term.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{term.definition}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ))}
    </div>
  )

  useEffect(() => {
    if (props.glossaryOpen) {
      setState({ right: true })
      props.glossaryTermSelected('', false)
    }
  }, [props.glossaryOpen])

  return (
    <Fragment>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
          {glossaryList('right')}
        </Drawer>
      </ClickAwayListener>
    </Fragment>
  )
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

export default connect(
  state => ({ glossaryTerm: state.glossary.glossaryTerm, glossaryOpen: state.glossary.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) })
)(GlossaryDrawer)
