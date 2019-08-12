import React, { useEffect, useRef }  from 'react'
import Explore from './Explore'
//import MapSection from '../../components/sections/MapSection'
import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'



const Revenue = (props) => {

    return (
	<Explore
	  title="revenue"
	  contentLeft={
		  <>
			<ExploreDataLink to="/explore/#revenue" icon="data"
					     >Explore revenue trends
			    </ExploreDataLink>
			    <ExploreDataLink
				  to="https://revenuedata.doi.gov/explore/#revenue"
				  icon="filter"
				  >Filter revenue data 
				</ExploreDataLink>
				<ExploreDataLink
				      to="https://revenuedata.doi.gov/explore/#revenue"
				      icon="data"
				      >Explore revenue by company
				    </ExploreDataLink>
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="https://revenuedata.doi.gov/explore/#revenue"
				icon="works"
				>Understand how revenue works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="https://revenuedata.doi.gov/explore/#revenue"
					icon="download"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


