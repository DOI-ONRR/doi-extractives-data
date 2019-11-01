import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import lazy from 'lazy.js'
import { glossaryTermSelected as glossaryTermSelectedAction } from '../../../state/reducers/glossary'
import GLOSSARY_TERMS from '../../../data/terms.yml'

console.log('GLOSSARY_TERMS: ', GLOSSARY_TERMS)

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})

const TemporaryDrawer = props => {
  
  const classes = useStyles()
  const [state, setState] = useState({
    right: false
  })

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [side]: open })
  }

  useEffect(() => {
    console.log('props.glossaryOpen: ', props.glossaryOpen)
  }, [props.glossaryOpen])

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        {['Glossary Item 1', 'Glossary Item 2', 'Glossary Item 3', 'Glossary Item 4'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div>
      <Button onClick={toggleDrawer('right', true)}>Open Right</Button>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
        {sideList('right')}
      </Drawer>
    </div>
  )
}

export default connect(
  state => ({ glossaryTerm: state.glossary.glossaryTerm, glossaryOpen: state.glossary.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) })
)(TemporaryDrawer)
