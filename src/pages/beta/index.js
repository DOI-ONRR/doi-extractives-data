import React, { useEffect, useRef }  from 'react'
import Helmet from 'react-helmet'
import { ApolloProvider } from '@apollo/react-hooks';


//import { useQuery } from '@apollo/react-hooks';
//import gql from 'graphql-tag';

import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";

import DefaultLayout from '../../components/layouts/DefaultLayout'
import { Tabordion, Tab } from '../../components/layouts/Tabordion'
import TabContainer from '../../components/layouts/Tabordion/TabContainer.js'
import RevenueTrends from '../../components/sections/RevenueTrends/RevenueTrendsApollo'
import TotalRevenue from '../../components/sections/TotalRevenue/TotalRevenue'
//import ExploreRevenue from '../components/sections/Explore/Revenue'


const client = new ApolloClient({
    uri: 'http://localhost:8080/v1/graphql'
});

/* 
client
  .query({
    query: gql`
       {
  commodity {
    commodity
    mineral_lease_type
    product
    revenue_category
    revenue_type
  }
}


     
    `
  })
    .then(result => console.log(result));
*/
/*const COMMODITYQL=gql`
{
  commodity {
    commodity
    mineral_lease_type
    product
    revenue_category
    revenue_type
  }
}
`
*/

const Beta = () => {
    return(
	<ApolloProvider client={client}> 
	<DefaultLayout>
	  <main>
	    <Helmet
	      title="Home | Natural Resources Revenue Data"
	      meta={[
		  // title
		  { name: 'og:title', content: 'Home | Natural Resources Revenue Data' },
		  { name: 'twitter:title', content: 'Home | Natural Resources Revenue Data' },
	      ]} >
	    </Helmet>
	    <section className="container-page-wrapper" >
	      <h3 className="h3-bar"></h3>
	      <p>asdfalasdf</p>
	    </section>
	    <Tabordion>
	      <Tab id="tab-revenue" name="Revenue">
		<TabContainer id="tab-container-revenue" name="Revenue"
			      title="Revenue"
			      info="The amount of money collected by the federal government from energy and mineral extraction on federal lands and waters and Native American lands."
			      contentLeft={<TotalRevenue/>}
			      contentRight={<RevenueTrends/>}
			      />
	      </Tab>
	      <Tab id="tab-revenue2" name="Revenue2">
		<TabContainer id="tab-container-revenue" name="Revenue"
			      title="Revenue"
			      info="The amount of money collected by the federal government from energy and mineral extraction on federal lands and waters and Native American lands."
			      contentRight={<RevenueTrends/>}
			      />
		</Tab>
	    </Tabordion>

	  </main>
	</DefaultLayout>
	</ApolloProvider>
    )
}

export default Beta
