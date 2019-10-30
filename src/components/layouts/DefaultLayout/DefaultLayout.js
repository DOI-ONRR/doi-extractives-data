import React, { Fragment } from 'react'
import Helmet from 'react-helmet'

import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import { Banner } from '../Banner'
import { AlertBanner } from '../AlertBanner'
import { Header } from '../Header'
import { Footer } from '../Footer'
import Glossary from '../../utils/Glossary'
// import Glossary from '../Drawer'
import utils from '../../../js/utils'

// import styles from '../../../css-global/base-theme.module.scss'
// import '../../../styles/_main.scss'
// import "../../../styles/print.scss";

import { withPrefixSVG } from '../../utils/temp-link'

// Render Meta Image with Prefix SVG
function renderMetaImage () {
  return withPrefixSVG('/img/unfurl_image.png')
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      background: (theme.paletteType === 'light') ? '#000' : '#fff',
      margin: 0
    }
  },
  root: {
    paddingTop: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0)
    }
  },
  skipNav: {
    position: 'absolute',
    top: '-1000px',
    left: '-1000px',
    height: '1px',
    width: '1px',
    textAlign: 'left',
    overflow: 'hidden',

    '&:active': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    },
    '&:focus': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    },
    '&:hover': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    }
  }
}))

const DefaultLayout = ({ children }) => {

  const classes = useStyles()

  const data = useStaticQuery(graphql`
	  query IndexLayoutQuery{
	    site {
	      siteMetadata {
	        title
	        description
	        version
	        googleAnalyticsId
	      }
	    }
	  }
  `)

  utils.hashLinkScroll()

  return (
    <Fragment>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        meta={[
          { name: 'google-site-verification', content: 'OxyG3U-Vtui-uK6wHUeOw83OgdfcfxvsWWZcb5x7aZ0' },
          // Mobile Specific Metas
          { name: 'HandheldFriendly', content: 'True' },
          { name: 'MobileOptimized', content: '320' },

          // type
          { name: 'og:type', content: 'website' },

          // title
          { name: 'og:title', content: 'Home | Natural Resources Revenue Data' },
          { name: 'twitter:title', content: 'Home | Natural Resources Revenue Data' },

          // img
          { name: 'og:image', content: renderMetaImage() },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:image', content: renderMetaImage() },

          // description
          { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
          { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
        ]}
      >
        <title>Home | Natural Resources Revenue Data</title>
        <link rel="icon" type="image/x-icon" href={withPrefixSVG('/img/favicon.ico')} />
        <link rel="icon" type="image/x-icon" href={withPrefixSVG('/img/favicon-16x16.png')} sizes="16x16" />
        <link rel="icon" type="image/x-icon" href={withPrefixSVG('/img/favicon-32x32.png')} sizes="32x32" />

        {/* Digital Analytics Program roll-up, see the data at https://analytics.usa.gov */}
        <script src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" id="_fed_an_ua_tag"></script>
        {data && data.site.siteMetadata.googleAnalyticsId &&
            <script>
              {"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '" + data.site.siteMetadata.googleAnalyticsId + "', 'auto');ga('set', 'anonymizeIp', true);ga('set', 'forceSSL', true);ga('send', 'pageview');"}
            </script>
        }

        {/* Google Tag Manager */}
        <script>
          {"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NCRF98R');"}
        </script>
        
      </Helmet>

      <a href="#main-content" className={classes.skipNav}>Skip to main content</a>

      <Banner />

      <Header siteMetadata={data && data.site.siteMetadata} />

      {/* <Glossary /> */}

      <div className={classes.root}>{children}</div>

      <Footer version={data && data.site.siteMetadata.version} />
    </Fragment>
  )
}

export default DefaultLayout
