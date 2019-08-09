import React, { useEffect, useRef }  from 'react'
import Explore from './Explore'
//import MapSection from '../../components/sections/MapSection'
import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'



const Revenue = (props) => {

    return (
	<Explore
	title="disbursements"
	  contentLeft={
		  <ExploreDataLink to="/explore/#revenue">
			Explore disbursments trends
		      </ExploreDataLink>
		      
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/explore/#revenue"
				>Understand how revenue works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/explore/#revenue"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


