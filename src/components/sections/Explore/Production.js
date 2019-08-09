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
			<ExploreDataLink to="https://revenuedata.doi.gov/explore/#revenue">
			      Explore trends on federal lands and waters
			    </ExploreDataLink>
			    <ExploreDataLink to="https://revenuedata.doi.gov/explore/#revenue">
				  Explore trends on Native American lands
				</ExploreDataLink>
				
		      </>
		  }
		  contentCenter={
			  <ExploreDataLink
				to="https://revenuedata.doi.gov/explore/#revenue"
				>Understand how production works
			      </ExploreDataLink>
			  }
			  
			  contentRight={
				  <ExploreDataLink
					to="https://revenuedata.doi.gov/explore/#revenue"
					>Download files and review scope
				      </ExploreDataLink>
				  }
				  />
	
    )
    
}

export default Revenue


