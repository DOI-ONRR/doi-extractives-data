import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'

import LocationSelector from '../../selectors/LocationSelector'
import Select from '../../selectors/Select'
import styles from './MapSection.module.scss'
import Map from '../../data-viz/Map' 




const MapSection = (props) => {


    const results=useStaticQuery(graphql`
query MyQuery {
  allResourceRevenuesFiscalYear(filter: {FiscalYear: {eq: "2018"}, State: {nin: ["withheld", "Not tied to a location", null]}}) {
    nodes {
      Revenue
      State
      County
    }
  }
}

`) 

    

	let data=format_data(results.allResourceRevenuesFiscalYear.nodes);
    console.debug(data);    
//    console.debug(props)
    let states=props.states
    console.debug(states);
    let options=states.map((value)=>{ return {value:value.state.frontmatter.unique_id,
					      name:value.state.frontmatter.title}})
//    console.debug(options);
    
    let offshore_regions =props.offshore_regions
return (
        <section className={styles.root}>
	<div className={styles.container +' container-page-wrapper'}>
	<div className={styles.containerLeft}>
	<h3>{props.title}</h3>
	<p>{props.info}</p>
	<LocationSelector
    default='Choose location'
    states={states}
    offshore_regions={offshore_regions}
	/>
	{/*
	  *     Eventually use more generalized MUI based combonent for now LocationSelector more plug and play here
	  *
	  *	<Select options={states} multiple={false} />
	  *
	  */}
	   

    </div>
	<div className={styles.containerRight}><Map mapFeatures={props.mapFeatures} mapData={data}/> </div>

	

    </div>
    </section>
)
}
export default MapSection


const format_data = (data)=> {
    let sumData={};
    for(let ii=0; ii<data.length; ii++) {
	let n=data[ii];
	
	let fips=state_fips[n.State]
	let value=n.Revenue
	
	if(sumData[fips]) {
	    sumData[fips]+=value;
	} else {
	    sumData[fips]=value;
	}
    }
    let r=[];
    for(let fips in sumData) {
	r.push([fips,sumData[fips]]);
    }
    return r;
}

const state_fips={
  "AK": "02",
  "AL": "01",
  "AR": "05",
  "AS": "60",
  "AZ": "04",
  "CA": "06",
  "CO": "08",
  "CT": "09",
  "DC": "11",
  "DE": "10",
  "FL": "12",
  "GA": "13",
  "GU": "66",
  "HI": "15",
  "IA": "19",
  "ID": "16",
  "IL": "17",
  "IN": "18",
  "KS": "20",
  "KY": "21",
  "LA": "22",
  "MA": "25",
  "MD": "24",
  "ME": "23",
  "MI": "26",
  "MN": "27",
  "MO": "29",
  "MS": "28",
  "MT": "30",
  "NC": "37",
  "ND": "38",
  "NE": "31",
  "NH": "33",
  "NJ": "34",
  "NM": "35",
  "NV": "32",
  "NY": "36",
  "OH": "39",
  "OK": "40",
  "OR": "41",
  "PA": "42",
  "PR": "72",
  "RI": "44",
  "SC": "45",
  "SD": "46",
  "TN": "47",
  "TX": "48",
  "UT": "49",
  "VA": "51",
  "VI": "78",
  "VT": "50",
  "WA": "53",
  "WI": "55",
  "WV": "54",
  "WY": "56"
}
    
