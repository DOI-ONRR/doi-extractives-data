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
			to="/explore/#federal-disbursements"
			icon="data"
			>
			Explore disbursments trends
		      </ExploreDataLink>
		      
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#disbursements"
				icon="works"
				>Understand how disbursements works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#disbursements"
					icon="download"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Disbursements


