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
					     >Revenue trends
			    </ExploreDataLink>
			    <ExploreDataLink
				  to="/explore/revenue"
				  icon="filter"
				  >Revenue in detail
				</ExploreDataLink>
				<ExploreDataLink
				      to="/how-it-works/federal-revenue-by-company/2018/"
				      icon="data"
				      >Revenue by company
				    </ExploreDataLink>
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#revenues"
				icon="works"
				>How revenue works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#revenue"
					icon="download"
					>Downloads and documentation
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


