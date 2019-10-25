import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { connect } from 'react-redux'
import Link from '../../utils/temp-link'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import styles from './Header.module.scss'

import { Search } from '../../utils/Search'

import { isIE } from 'react-device-detect'

import { BrowserBanner } from '../BrowserBanner'
import NRRDLogo from '../../../img/NRRD-logo.svg'
import MobileNavMenuIcon from '-!svg-react-loader!../../../img/icons/icon-menu.svg'
import IconCloseX from '-!svg-react-loader!../../../img/icons/icon-close-x.svg'

import { glossaryTermSelected as glossaryTermSelectedAction } from '../../../state/reducers/glossary'

const styles = theme => ({
  'root': {
    marginTop: theme.spacing(2),
    maxWidth: '1280px'
  },
  'mobileNav': {},
  'mobileNavMenuIcon': {
    cssFloat: 'right'
  },
  'mobileNavDrawer': {
    backgroundColor: '--blue',
    boxSizing: 'border-box',
    color: 'white',
    padding: '32px',
    top: '0',
    right: '0',
    overflow: 'hidden',
    position: 'absolute',
    width: '300px',
    zIndex: '5000'
  },
  'mobileNavDrawerClose': {
    textAlign: 'right'
  },
  'mobileNavDrawerLinks': {
    listStyleType: 'none',
    marginBottom: '0',
    padding: '1.25em',
    paddingBottom: '0'
  },
  'mobileNavDrawerLinkItem': {
    margin: '0 0 1rem 0',
    color: '--white',
    textDecoration: 'none',
    fontFamily: '--baseFontFamily',
    fontSize: '1rem',
    lineHeight: '1.375rem',
    marginBottom: '0.625rem',
    fontWeight: '600',
    letterSpacing: '2px',
    paddingBottom: '1.6em',
    textTransform: 'uppercase'
  },
  'mobileNavDrawerLinkItemBreak': {
    borderBottom: '1px solid --white',
    marginBottom: '2.5em',
    paddingBottom: '2.5em'
  },
  'mobileNavDrawerLinkItem2': {
    margin: '0 0 1rem 0',
    color: '#ffffff',
    textDecoration: 'none',
    fontFamily: '--baseFontFamily',
    fontSize: '1rem',
    lineHeight: '1.375rem',
    marginBottom: '0.625rem',
    paddingBottom: '1.6em'
  }
})

const Header = props => {
  const { classes } = props
  let defaultNavClassNames = { 'className': ' header-nav_item ' }
  let homeClassNames = { 'className': ' header-nav_item ' }
  let aboutClassNames = { 'className': ' header-nav_item ' }
  let howItWorksClassNames = { 'className': ' header-nav_item ' }
  let exploreClassNames = { 'className': ' header-nav_item ' }
  let downloadClassNames = { 'className': ' header-nav_item_link_top ' }

  if (typeof location !== 'undefined' && location) {
    let prefix = __PATH_PREFIX__
    if (__PATH_PREFIX__ && __PATH_PREFIX__.length > 0) {
      prefix = __PATH_PREFIX__.slice(0, -14)
    }

    if (location.pathname.includes('/about')) {
      aboutClassNames.className += ' active '
    }
    else if (location.pathname.includes('/downloads')) {
      downloadClassNames.className += ' active '
    }
    else if (location.pathname.includes('/how-it-works')) {
      howItWorksClassNames.className += ' active '
    }
    else if (location.pathname.includes('/explore')) {
      exploreClassNames.className += ' active '
    }
    else if (location.pathname.includes('/archive')) {
      aboutClassNames.className
    }
    else {
      homeClassNames.className += ' active '
    }
  }
  return (
    <header className={classes.root + ' container-page-wrapper'}>
      { isIE && <BrowserBanner /> }
      <Grid container spacing={2} direction={'row'} justify={'space-between'} align={'flex-start'}>
        <Grid item xs='6'>
          <div className="header-left">
            <Link className="header-image_link" to="/">
              <h1 className="sr-only">
                US Department of the Interior Natural Resources Revenue Data
              </h1>
              <img className="header-image" src={NRRDLogo} alt="Logo" />
            </Link>
          </div>
        </Grid>
        <Grid item xs='6'>
          <MediaQuery minWidth={769}>
            <nav className="header-nav header-right">
              <ul className="header-nav_top">
                <li style={{ width: '200px' }} className="header-nav_item_top">{' '}</li>
                <li className="header-nav_item_top">
                  <a href="#" onClick={() => props.glossaryTermSelected('', true)} className="header-nav_item_link_top js-glossary-toggle" alt="this is the glossary drawer">Glossary</a>
                </li>
                <li className="header-nav_item_top">
                  <Link {...downloadClassNames} to="/downloads/">Download data </Link>
                </li> <li className="header-nav_item_top">
                  <Search />
                </li>

              </ul>
              <ul className="header-nav_bottom">
                <li {...homeClassNames}>
                  <Link className="header-nav_item_link" to="/"> Home </Link>
                </li> <li {...howItWorksClassNames}>
                  <Link className="header-nav_item_link" to="/how-it-works/"> How it works </Link>
                </li> <li {...exploreClassNames}>
                  <Link className="header-nav_item_link" to="/explore/"> Explore data </Link>
                </li> <li {...aboutClassNames}>
                  <Link className="header-nav_item_link" to="/about/"> About </Link>
                </li>
              </ul>
            </nav>
          </MediaQuery>
        </Grid>
      </Grid>
      <MediaQuery maxWidth={768}>
        <MobileNav glossaryTermSelected={props.glossaryTermSelected}/>
      </MediaQuery>
    </header>
  )
}
export default connect(
  state => ({ glossaryOpen: state.glossary.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) })
)(withStyles(styles)(Header))

class MobileNav extends React.Component {
  state = {
    drawOpen: false,
  }

  render () {
    let self = this

    return (
      <div className={styles.mobileNav}>
        {!self.state.drawOpen &&
          <div className={styles.mobileNavMenuIcon} onClick={() => self.setState({ drawOpen: true })}>
            <MobileNavMenuIcon />
          </div>
        }
        {self.state.drawOpen &&
          <div className={styles.mobileNavDrawer} aria-hidden={false}>

            <div onClick={() => self.setState({ drawOpen: false })} className={styles.mobileNavDrawerClose}><IconCloseX /></div>
            <Search isMobile={true} />
            <ul className={styles.mobileNavDrawerLinks}>
              <li className={styles.mobileNavDrawerLinkItem}>
                <Link className={styles.mobileNavDrawerLinkItem} to="/"> Home </Link>
              </li>
              <li className={styles.mobileNavDrawerLinkItem}>
                <Link className={styles.mobileNavDrawerLinkItem} to="/how-it-works/"> How it works </Link>
              </li>
              <li className={styles.mobileNavDrawerLinkItem}>
                <Link className={styles.mobileNavDrawerLinkItem} to="/explore/"> Explore data </Link>
              </li>
              <li className={styles.mobileNavDrawerLinkItem}>
                <Link className={styles.mobileNavDrawerLinkItem} to="/about/"> About </Link>
              </li>
              <li className={styles.mobileNavDrawerLinkItem2}>
                <Link className={styles.mobileNavDrawerLinkItem2} to="/downloads/"> Download data </Link>
              </li>
              <li className={styles.mobileNavDrawerLinkItem2}>
                <a href="#" onClick={() => this.props.glossaryTermSelected('', true)}
                  className={styles.mobileNavDrawerLinkItem2} alt="this is the glossary drawer">Glossary</a>
              </li>
            </ul>
          </div>
        }
      </div>
    )
  }
}
