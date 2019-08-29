import React, { useEffect, useRef }  from 'react'
import Explore from './Explore'
//import MapSection from '../../components/sections/MapSection'
import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'



const Revenue = (props) => {

    return (
	<Explore
	  title="production"
	  contentLeft={
		  <>
		  <ExploreDataLink to="/explore/#federal-production" icon="data">
			      Production trends on federal lands and waters
			    </ExploreDataLink>
			    <ExploreDataLink to="/how-it-works/native-american-production/#production-on-native-american-land" icon="data">
				  Production trends on Native American lands
				</ExploreDataLink>
				
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#production"
				icon="works"
				>How production works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#production"
					icon="download"
					>Downloads and documentation
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


