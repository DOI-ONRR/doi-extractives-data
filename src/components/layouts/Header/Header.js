import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { connect } from 'react-redux'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import useMediaQueries from '@material-ui/core/useMediaQuery'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import { Search } from '../../utils/Search'

import { isIE } from 'react-device-detect'

import { BrowserBanner } from '../BrowserBanner'
import NRRDLogo from '../../../img/NRRD-logo.svg'
import MobileNavMenuIcon from '-!svg-react-loader!../../../img/icons/icon-menu.svg'
import IconCloseX from '-!svg-react-loader!../../../img/icons/icon-close-x.svg'

import { glossaryTermSelected as glossaryTermSelectedAction } from '../../../state/reducers/glossary'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    boxShadow: 'none',
    maxHeight: '135px',
    borderBottom: '2px solid #cde3c3',
    paddingBottom: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  headerImage: {
    marginTop: theme.spacing(2),
    marginBottom: 'auto',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '225px'
    }
  },
  headerRight: {
    width: 'auto',
    textAlign: 'right',
    marginRight: '0',
    fontFamily: theme.typography.fontFamily,
    listStyle: 'none',
    display: 'inline-block',
    '& li > a': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
      cursor: 'pointer',
      textDecoration: 'none',
      color: theme.palette.common.black
    },
    '& li': {
      listStyle: 'none',
      display: 'inline-block',
      margin: theme.palette.margin
    },
    '& li a:hover': {
      textDecoration: 'underline'
    }
  },
  headerNavItem: {
    fontSize: theme.typography.h4.fontSize
  },
  top: {
    '& li > a': {
      fontSize: theme.typography.button.fontSize,
      paddingRight: theme.spacing(2),
      display: 'table-cell',
      verticalAlign: 'middle'
    },
    '& li': {
      position: 'relative',
      top: theme.spacing(0)
    },
    '& li:last-child': {
      position: 'relative',
      top: theme.spacing(0)
    }
  },
  bottom: {
    '& li > a': {
      fontSize: theme.typography.h6.fontSize
    },
    '& li.active a': {
      fontWeight: theme.typography.fontWeightBold
    },
    '& li:last-child a': {
      marginRight: theme.spacing(0)
    }
  }

}))

const Header = props => {
  const classes = useStyles()

  let homeClassNames = { 'className': classes.headerNavItem }
  let aboutClassNames = { 'className': classes.headerNavItem }
  let howItWorksClassNames = { 'className': classes.headerNavItem }
  let exploreClassNames = { 'className': classes.headerNavItem }
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
    <Container maxWidth="lg">
      <header className={classes.root}>
        {isIE && <BrowserBanner />}
        <Grid
          container
          spacing={2}
          direction={'row'}
          justify={'space-between'}
          align={'flex-start'}
        >
          <Grid item xs={6}>
            <Link className="classes.headerImageLink" to="/">
              <img
                className={classes.headerImage}
                src={NRRDLogo}
                alt="US Department of the Interior Natural Resources Revenue Data"
              />
            </Link>
          </Grid>
          <Grid item xs={6} className={classes.headerRight}>
            <nav className={`${ classes.headerRight } ${ classes.top }`}>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={() => props.glossaryTermSelected('', true)}
                    className={classes.link}
                    alt="this is the glossary drawer"
                  >
                    Glossary
                  </a>
                </li>
                <li>
                  <Link className={classes.link} to="/downloads/">
                    Download data{' '}
                  </Link>
                </li>
                <li>
                  <Search />
                </li>
              </ul>
            </nav>
            <nav className={`${ classes.headerRight } ${ classes.bottom }`}>
              <ul>
                <li {...homeClassNames}>
                  <Link className={classes.link} to="/">
                      Home
                  </Link>
                </li>
                <li {...howItWorksClassNames}>
                  <Link className={classes.link} to="/how-it-works/">
                      How it works
                  </Link>
                </li>
                <li {...exploreClassNames}>
                  <Link className={classes.link} to="/explore/">
                      Explore data
                  </Link>
                </li>
                <li {...aboutClassNames}>
                  <Link className={classes.link} to="/about/">
                      About{' '}
                  </Link>
                </li>
              </ul>
            </nav>
            <MediaQuery maxWidth={768}>
              <MobileNav glossaryTermSelected={props.glossaryTermSelected}/>
            </MediaQuery>
          </Grid>
        </Grid>
      </header>
    </Container>
  )
}
export default connect(
  state => ({ glossaryOpen: state.glossary.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) })
)(Header)

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
