import React from 'react';
import Helmet from 'react-helmet';
import {Provider} from 'react-redux';

import createStore from 'state/createStore';

import Banner from 'components/layouts/banner';
import Header from 'components/layouts/header';
import Footer from 'components/layouts/footer';
import Glossary from 'components/utils/Glossary';

import "styles/_main.scss";

import { withPrefix } from 'components/utils/temp-link';

const store = createStore();

export default ({ data, children}) => {
  return (
    <Provider store={store}>
      <div>
        <Helmet
          title="Home | Natural Resources Revenue Data"
          meta={[
            { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
          ]}
        >
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

