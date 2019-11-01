import React from 'react'
import Link from '../../utils/temp-link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    background: '#f0f6fa',
    fontSize: '1.2em'
  },
  ul: {
    marginLeft: theme.spacing(0)
  },
  li: {
    paddingBottom: theme.spacing(1)
  }
}))

const WhatsNew = props => {
  const classes = useStyles()

  return (
    <section className={`${ classes.root } slab-delta`}>
      <Container maxWidth="lg">
        <h2>What's new</h2>
        <p>In our latest release on October 25, 2019, we made the following changes:</p>
        <ul>
          <li>Updated revenue and disbursements data through Fiscal Year 2019 </li>
          <li>Updated monthly production data through June 2019 </li>
          <li>Added <Link to="/blog">blog post about designing for accessibility and inclusion</Link></li>
        </ul>

        <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
      </Container>
    </section>
  )
}

export default WhatsNew
