import React from 'react'
import Link from '../../utils/temp-link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3)
  }
}))

const WhatsNew = props => {
  const classes = useStyles()

  return (
    <section className={classes.root + ' slab-delta'}>
      <Container maxWidth="lg">
        <h2>What's new</h2>
        <p>In our latest release on October 25, 2019, we made the following changes:</p>
        <ul className="list-bullet ribbon-card-top-list">
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
