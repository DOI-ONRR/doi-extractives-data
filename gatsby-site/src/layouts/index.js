import React from 'react';
import Helmet from 'react-helmet';
import {Provider} from 'react-redux';

import createStore from 'store/create-store';

import Banner from 'components/layouts/banner';
import Header from 'components/layouts/header';
import Footer from 'components/layouts/footer';
import Glossary from 'components/utils/Glossary';

import "styles/_main.scss";
import "styles/print.scss";

import { withPrefix } from 'components/utils/temp-link';

const store = createStore();

export default ({ data, children}) => {
  let meta_image = withPrefix("/img/unfurl_image.png");
  return (
    <Provider store={store}>
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
          <link rel="icon" type="image/x-icon" href={withPrefix("/img/favicon.ico")} />
          <link rel="icon" type="image/x-icon" href={withPrefix("/img/favicon-16x16.png")} sizes="16x16" />
          <link rel="icon" type="image/x-icon" href={withPrefix("/img/favicon-32x32.png")} sizes="32x32" />
        </Helmet>
        <Banner />
        <Header siteMetadata={data.site.siteMetadata} />

        <main>
          <Glossary terms={data.allTermsYaml.edges} />

          {children()}
        </main>

        <Footer siteMetadata={data.site.siteMetadata} />

      </div>
    </Provider>
  );
}

export const query = graphql`
  query IndexLayoutQuery{
    allTermsYaml {
      edges {
        node {
          name
          definition
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        version
      }
    }
  }
`;

