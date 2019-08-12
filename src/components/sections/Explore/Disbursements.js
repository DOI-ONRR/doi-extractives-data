import React, { useEffect, useRef }  from 'react'
import Explore from './Explore'
//import MapSection from '../../components/sections/MapSection'
import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'



const Disbursements = (props) => {

    return (
	<Explore
	title="disbursements"
	  contentLeft={
		  <ExploreDataLink
			to="/explore/#revenue"
			icon="data"
			>
			Explore disbursments trends
		      </ExploreDataLink>
		      
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/explore/#revenue"
				icon="works"
				>Understand how revenue works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/explore/#revenue"
					icon="download"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Disbursements


