import React, { useEffect, useRef }  from 'react'
import Explore from './Explore'
//import MapSection from '../../components/sections/MapSection'
import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'



const Revenue = (props) => {

    return (
	<Explore
	  title="Production"
	  contentLeft={
		  <>
		  <ExploreDataLink to="/explore/#federal-production" icon="data">
			      Explore trends on federal lands and waters
			    </ExploreDataLink>
			    <ExploreDataLink to="/how-it-works/native-american-production/#production-on-native-american-land" icon="data">
				  Explore trends on Native American lands
				</ExploreDataLink>
				
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="/how-it-works/#production"
				icon="works"
				>Understand how production works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="/downloads/#production"
					icon="download"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


