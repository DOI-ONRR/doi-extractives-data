import React from 'react'
import Link from '../../utils/temp-link'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import logo from '../../../img/DOI-2x.png'
import DownloadIcon from '-!svg-react-loader!../../../img/svg/icon-download-base.svg'
import BullhornIcon from '-!svg-react-loader!../../../img/svg/icon-bullhorn.svg'

import CONTACT_INFO from '../../../data-graphql/contact/contact.yml'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    backgroundColor: '#323c42',
    color: '#d3dfe6' // TODO: clean up styling
  },
  footer: {},
  linkActiveBeta: {
    color: theme.palette.common.white
  },
  footerImage: {
    maxWidth: '110px',
    width: '80%',
  }
}))

const Footer = ({ version }) => {
  const classes = useStyles()

  return (
    <footer className={`${ classes.root } ${ classes.footer }`}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <a href="https://doi.gov"><img className={classes.footerImage} src={logo} alt="Department of the Interior logo" /></a>
          </Grid>
          <Grid item xs={5}>
            <p className="footer-para_callout footer-para_callout-bigger">Built in the open</p>
            <p className="footer-para">This site (<a href={'https://github.com/onrr/doi-extractives-data/releases/' + version } className={classes.linkActiveBeta}>{ version }</a>)
          is powered by <Link className="classs.footerLink" to="/downloads" className={classes.linkActiveBeta}>open data</Link> and <a className={classes.linkActiveBeta} href="https://github.com/ONRR/doi-extractives-data/">source code</a>.<br />
          We welcome contributions and comments on <a className={classes.linkActiveBeta} href="https://github.com/ONRR/doi-extractives-data/issues/new">GitHub</a>. We write about how we work on this site on <Link className="classs.footerLink" to="/blog" className={classes.linkActiveBeta}>our team's blog</Link>.</p>
            <p className="footer-para-small footer-para_last"><a href="https://www.doi.gov/" className={classes.linkActiveBeta}>Department of the Interior</a> | <a href="https://www.doi.gov/privacy" className={classes.linkActiveBeta}>Privacy Policy</a> | <a href="https://www.doi.gov/foia" className={classes.linkActiveBeta}>FOIA</a> | <a href="https://www.usa.gov/" className={classes.linkActiveBeta}>USA.gov</a></p>
          </Grid>
          <Grid item xs={5}>
            <p className="footer-para_callout">
              <Link className="classs.footerLink" to="/downloads/" className={classes.linkActiveBeta}>Download data <DownloadIcon /></Link>
            </p>
            <p className="footer-para footer-para-small">
              Office of Natural Resources Revenue, { CONTACT_INFO.information_data_management.name }<br/>
              { CONTACT_INFO.information_data_management.street }<br/>
              { CONTACT_INFO.information_data_management.city } { CONTACT_INFO.information_data_management.zip }<br/>
              <a className={classes.linkActiveBeta} href={'mailto:' + CONTACT_INFO.information_data_management.email}>{ CONTACT_INFO.information_data_management.email }</a>
            </p>
          </Grid>
        </Grid>
      </Container>
    </footer>
  )
}

Footer.propTypes = {
  /** The version of the site release. */
  version: PropTypes.string.isRequired,
}
export default Footer
