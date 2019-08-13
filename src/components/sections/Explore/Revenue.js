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
				  to="/explore/revenue"
				  icon="filter"
				  >Filter revenue data 
				</ExploreDataLink>
				<ExploreDataLink
				      to="/how-it-works/federal-revenue-by-company/2018/"
				      icon="data"
				      >Explore revenue by company
				    </ExploreDataLink>
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#revenues"
				icon="works"
				>Learn how revenue works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#revenue"
					icon="download"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


