import React from 'react';
import Helmet from 'react-helmet';
import Banner from 'components/layouts/Banner';
import Header from 'components/layouts/Header';
import Footer from 'components/layouts/Footer';
import Glossary from 'components/utils/Glossary';

import "styles/_main.scss";

export default ({ data, children}) => {
  return (
    <div>
      <Helmet
        title="Home | Natural Resources Revenue Data"
        meta={[
          { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
          { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
        ]}
      />
      <Banner />
      <Header siteMetadata={data.site.siteMetadata} />
    
      <main>
        <Glossary terms={data.allTermsYaml.edges} />

        {children()}
      </main>

      <Footer contactInfo={data.dataYaml} siteMetadata={data.site.siteMetadata} />
    </div>
  );
}

export const query = graphql`
  query HomePageQuery{
    dataYaml{
      data_retrieval {
        name
        email
      }
      information_data_management {
        name
        street
        city
        zip
        email
      }
    }
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

