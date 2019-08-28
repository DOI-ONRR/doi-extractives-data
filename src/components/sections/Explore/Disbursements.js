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
			Disbursements trends
		      </ExploreDataLink>
		      
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#disbursements"
				icon="works"
				>How disbursements work
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#disbursements"
					icon="download"
					>Downloads and documentation
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Disbursements


