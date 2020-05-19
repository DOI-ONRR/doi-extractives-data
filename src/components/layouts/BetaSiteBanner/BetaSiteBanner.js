import React from 'react'

import {
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff1d2',
    margin: '0 0 .8rem 0',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.1875rem',
    padding: '0.8em 1.875em',
    textAlign: 'center',
    '& a': {
      textDecoration: 'underline',
    }
  }
}))

const BetaSiteBanner = () => {
  const classes = useStyles()

  return (
    <Box component="section" className={classes.root}>
      <Box component="span">
        We've been hard at work on a new version of the site.  Test out the new <a href="https://nrrd-beta.app.cloud.gov" target="_blank">beta site</a>.
      </Box>
    </Box>
  )
}

export default BetaSiteBanner
