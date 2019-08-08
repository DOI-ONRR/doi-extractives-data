import React from 'react'
import Helmet from 'react-helmet'

import { useStaticQuery, graphql } from 'gatsby'

import { Banner } from '../Banner'
import { AlertBanner } from '../AlertBanner'
import { Header } from '../Header'
import { Footer } from '../Footer'
import Glossary from '../../utils/Glossary'
import utils from '../../../js/utils'

import '../../../styles/_main.scss'
// import "../../../styles/print.scss";

import { withPrefixSVG } from '../../utils/temp-link'

const DefaultLayout = ({ children }) => {
  let meta_image = withPrefixSVG('/img/unfurl_image.png')
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

  utils.hashLinkScroll();

  return (
    <div>
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
          { name: 'og:image', content: meta_image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:image', content: meta_image },

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

      </Helmet>

      <Banner />

      <Header siteMetadata={data && data.site.siteMetadata} />

      <Glossary />

      {children}

      <Footer version={data && data.site.siteMetadata.version} />
    </div>
  )
}

export default DefaultLayout
