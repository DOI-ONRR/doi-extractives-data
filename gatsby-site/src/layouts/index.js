import React from 'react';
import Helmet from 'react-helmet';

import {Banner} from '../components/layouts/Banner';
import {Header} from '../components/layouts/Header';
import {Footer} from '../components/layouts/Footer';
import Glossary from '../components/utils/Glossary';

import "styles/_main.scss";
import "styles/print.scss";

import { withPrefixSVG } from 'components/utils/temp-link';

export default ({ data, children}) => {
  let meta_image = withPrefixSVG("/img/unfurl_image.png");

  return (
      <div>
        <Helmet
          meta={[
            { name: "google-site-verification", content: "OxyG3U-Vtui-uK6wHUeOw83OgdfcfxvsWWZcb5x7aZ0"},
            //Mobile Specific Metas
            { name: "HandheldFriendly", content: "True"},
            { name: "MobileOptimized", content: "320"},

            // type
            { name: "og:type", content: "website"},

            // title
            { name: "og:title", content: "Home | Natural Resources Revenue Data"},
            { name: "twitter:title", content: "Home | Natural Resources Revenue Data"},

            // img
            { name: "og:image", content: meta_image},
            { name: "twitter:card", content: "summary_large_image"},
            { name: "twitter:image", content: meta_image},

            // description
            { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
          ]}
        >
          <title>Home | Natural Resources Revenue Data</title>
          <link rel="icon" type="image/x-icon" href={withPrefixSVG("/img/favicon.ico")} />
          <link rel="icon" type="image/x-icon" href={withPrefixSVG("/img/favicon-16x16.png")} sizes="16x16" />
          <link rel="icon" type="image/x-icon" href={withPrefixSVG("/img/favicon-32x32.png")} sizes="32x32" />

          {/* Digital Analytics Program roll-up, see the data at https://analytics.usa.gov */}
          <script src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" id="_fed_an_ua_tag"></script>
          {data.site.siteMetadata.googleAnalyticsId &&
            <script>
              {"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '"+data.site.siteMetadata.googleAnalyticsId+"', 'auto');ga('set', 'anonymizeIp', true);ga('set', 'forceSSL', true);ga('send', 'pageview');"}
            </script>
          }

          {/* Google Tag Manager */}
          <script>
            {"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NCRF98R');"}
          </script>
          <noscript>
            {'<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NCRF98R" height="0" width="0" style="display:none;visibility:hidden"></iframe>'}
          </noscript>
        </Helmet>
        <Banner />
        <Header siteMetadata={data.site.siteMetadata} />

        <main>
          <Glossary />

          {children()}
        </main>

        <Footer version={data.site.siteMetadata.version} />

      </div>
  );
}

export const query = graphql`
  query IndexLayoutQuery{
    site {
      siteMetadata {
        title
        description
        version
        googleAnalyticsId
      }
    }
    offshore_data:allMarkdownRemark (filter:{id: {regex: "/offshore_regions/"}}) {
      offshore_regions:edges {
        offshore_region:node {
          frontmatter {
            title
            unique_id
            permalink
            is_cropped
          }
        }
      }
    }
    states_data:allMarkdownRemark (filter:{id: {regex: "/states/"}}) {
      states:edges {
        state:node {
          frontmatter {
            title
            unique_id
            is_cropped
          }
        }
      }
    }
  }

`;

