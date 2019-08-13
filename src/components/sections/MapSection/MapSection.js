import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'
import Link, { withPrefix as withPrefixGatsby } from 'gatsby-link'
import LocationSelector from '../../selectors/LocationSelector'
import Select from '../../selectors/Select'
import styles from './MapSection.module.scss'
import Map from '../../data-viz/Map' 

/**
*  MapSection  a section component that renders data with location navigation.  
*  Caveat either MapSection should be generalized so graphql can be provided or this component should renamed RevenueMapSection 
*
*  @param {string}  title - A string that is the bold large text in section
*  @param {string}  info - A string that is the smaller info text in section
*  @param {array[]} states - a list of states for building drop down.  With location table we could encapsulate that here or even in Location
*  @param {array[]} offshore_regions - a list of regions  for building drop down.  With location table we could encapsulate that here or even in Location
*  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
*  @param {string} [mapOffshoreJson=/maps/offshore/offshore.json] mapOffshoreJson - url for topojson data for offshore if left blank offshore is not painted
*  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
*  @param {*} onClick function that determines what to do if area is clicked
*
*/

const MapSection = (props) => {


    const results=useStaticQuery(graphql`
query MyQuery {
  allResourceRevenuesFiscalYear(filter: {FiscalYear: {eq: "2018"}, State: {nin: ["withheld", "Not tied to a location"]}}) {
    nodes {
      Revenue
      State
      County
      OffshorePlanningArea
    }
  }
}

`) 
    let data=[];
    let onClick=props.onClick;
    if(props.mapFeatures == 'states' ) {
	data=state_summary(results.allResourceRevenuesFiscalYear.nodes);
    } else if (props.mapFeatures == 'counties') {
	data=county_summary(results.allResourceRevenuesFiscalYear.nodes);
    }

    let offshore_data=offshore_summary(results.allResourceRevenuesFiscalYear.nodes);

    let states=props.states || [];
    let options=states.map((value)=>{ return {value:value.state.frontmatter.unique_id,
					      name:value.state.frontmatter.title}})
//    console.debug(options);
    let offshoreJson=withPrefixGatsby(props.mapOffshoreJson);
    let mapJson=withPrefixGatsby(props.mapJson);
    let mapJsonObject=props.mapJsonObject;
    let offshore_regions =props.offshore_regions || []
return (
    <section className={styles.root}>
      <div className={styles.container +' container-page-wrapper'}>
	<div className={styles.containerLeft}>
	  <h3>{props.title}</h3>
	  <p>{props.info}</p>
	</div>
	<div className={styles.containerRight}>
	  <LocationSelector
	    default='Choose location'
            label="Explore a state or offshore region:" 
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
	<div className={styles.containerBottom}><Map mapFeatures={props.mapFeatures} mapData={data} offshoreData={offshore_data} mapJson={mapJson} mapOffshoreJson={offshoreJson} mapJsonObject={mapJsonObject} colorScheme={props.mapColor} offshoreColorScheme={props.offshoreMapColor} mapTitle={props.mapTitle} onClick={onClick} /> </div>
	
	
	
      </div>
    </section>
)
}
export default MapSection

/**
*  state_summary - helper function to summarize data to state level. 
*
*  @param {*}  graphql result set with revenue, county and state for current fiscal year
*  @return  array[][] returns two diminsional array of fips, revenue for use in map
*/


const state_summary = (data)=> {
 //   return [[]]
    let sumData={};
    for(let ii=0; ii<data.length; ii++) {
	let n=data[ii];
	
	//	let fips=state_fips[n.State]
	if(n.State) {
	    let fips=n.State
	    let value=n.Revenue
	    
	    if(sumData[fips]) {
		sumData[fips]+=value;
	    } else {
		sumData[fips]=value;
	    }
	}
    }
    let r=[];
    for(let fips in sumData) {
	r.push([fips,sumData[fips]]);
    }
    return r;
}

/**
*  county_summary - helper function to summarize data to county level. 
*
*  @param {*}  graphql result set with revenue, county and state for current fiscal year
*  @return  array[][] returns two diminsional array of fips, revenue for use in map
*/

const county_summary = (data)=> {
    let sumData={};
    for(let ii=0; ii<data.length; ii++) {
	let n=data[ii];
	let fips=county_fips[n.County]
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

/**
*  offshore_summary - helper function to summarize data to offshore planning area level. 
*
*  @param {*}  graphql result set with revenue, county and state for current fiscal year
*  @return  array[][] returns two diminsional array of fips, revenue for use in map
*/

const offshore_summary = (data)=> {
    //    return [[]]
    let sumData={};
    for(let ii=0; ii<data.length; ii++) {
	let n=data[ii];
	if(n.OffshorePlanningArea) {
	    let fips=offshore_planning_area[n.OffshorePlanningArea] || n.OffshorePlanningArea;
	    let value=n.Revenue
	    
	    if(sumData[fips]) {
		sumData[fips]+=value;
	    } else {
		sumData[fips]=value;
	    }
	}
    }
    let r=[];
    for(let fips in sumData) {
	r.push([fips,sumData[fips]]);
    }
    return r;
}
const offshore_planning_area={
    "Offshore Aleutian Arc":"ALA",
    "Offshore Aleutian Basin":"ALB",
    "Offshore Beaufort Sea":"BFT",
    "Offshore Bowers Basin":"BOW",
    "Offshore Chukchi Sea":"CHU",
    "Offshore Cook Inlet":"COK",
    "Offshore St. George Basin":"GEO",
    "Offshore Gulf of Alaska":"GOA",
    "Offshore Hope Basin":"HOP",
    "Offshore Kodiak":"KOD",
    "Offshore St. Matthew-Hall":"MAT",
    "Offshore North Aleutian Basin":"NAL",
    "Offshore Navarin Basin":"NAV",
    "Offshore Norton Basin":"NOR",
    "Offshore Shumagin":"SHU",
    "Offshore Florida Straits":"FLS",
    "Offshore Mid Atlantic":"MDA",
    "Offshore North Atlantic":"NOA",
    "Offshore South Atlantic":"SOA",
    "Offshore Western Gulf of Mexico":"WGM",
    "Offshore Central Gulf of Mexico":"CGM",
    "Offshore Eastern Gulf of Mexico":"EGM",
    "Offshore Central California":"CEC",
    "Offshore Northern California":"NOC",
    "Offshore Southern California":"SOC",
    "Offshore Washington-Oregon":"WAO"
}

/**
*  state_fips object for looking up fips from abbrev
*
*
*/

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
    
const county_fips= {
"Baldwin":"01003",
"Bibb":"01007",
"Blount":"01009",
"Clarke":"01025",
"Conecuh":"01035",
"Covington":"01039",
"Escambia":"01053",
"Hale":"01065",
"Jefferson":"01073",
"Lamar":"01075",
"Mobile":"01097",
"Perry":"01105",
"Pickens":"01107",
"Shelby":"01117",
"Tuscaloosa":"01125",
"Kenai Peninsula":"02122",
"North Slope":"02185",
"Coconino":"04005",
"Maricopa":"04013",
"Cleburne":"05023",
"Columbia":"05027",
"Conway":"05029",
"Faulkner":"05045",
"Fulton":"05049",
"Johnson":"05071",
"Montgomery":"05097",
"Pope":"05115",
"Sebastian":"05131",
"White":"05145",
"Contra Costa":"06013",
"Glenn":"06021",
"Inyo":"06027",
"Kings":"06031",
"Lassen":"06035",
"Mono":"06051",
"Riverside":"06065",
"San Bernardino":"06071",
"San Joaquin":"06077",
"Santa Barbara":"06083",
"Solano":"06095",
"Sutter":"06101",
"Adams":"08001",
"Archuleta":"08007",
"Bent":"08011",
"Chaffee":"08015",
"Delta":"08029",
"Elbert":"08039",
"Garfield":"08045",
"Huerfano":"08055",
"Kiowa":"08061",
"La Plata":"08067",
"Las Animas":"08071",
"Logan":"08075",
"Moffat":"08081",
"Montrose":"08085",
"Park":"08093",
"Pitkin":"08097",
"Rio Blanco":"08103",
"Routt":"08107",
"Sedgwick":"08115",
"Weld":"08123",
"Hardee":"12049",
"Polk":"12105",
"Bear Lake":"16007",
"Bonneville":"16019",
"Caribou":"16029",
"Clark":"16033",
"Latah":"16057",
"Washington":"16087",
"Fayette":"17051",
"Jefferson":"17081",
"Gibson":"18051",
"Cheyenne":"20023",
"Ellsworth":"20053",
"Gove":"20063",
"Hamilton":"20075",
"Kearny":"20093",
"Logan":"20109",
"Meade":"20119",
"Seward":"20175",
"Stanton":"20187",
"Trego":"20195",
"Floyd":"21071",
"Henderson":"21101",
"Lawrence":"21127",
"Letcher":"21133",
"Meade":"21163",
"Owsley":"21189",
"Union":"21225",
"Avoyelles":"22009",
"Bienville":"22013",
"Caddo":"22017",
"Cameron":"22023",
"Claiborne":"22027",
"De Soto":"22031",
"Grant":"22043",
"Lafourche":"22057",
"Lincoln":"22061",
"Natchitoches":"22069",
"Plaquemines":"22075",
"Rapides":"22079",
"Sabine":"22085",
"St. Mary":"22101",
"Vermilion":"22113",
"Webster":"22119",
"West":"22719",
"Garrett":"24023",
"Allegan":"26005",
"Antrim":"26009",
"Calhoun":"26025",
"Clare":"26035",
"Crawford":"26039",
"Grand Traverse":"26055",
"Kalkaska":"26079",
"Manistee":"26101",
"Montmorency":"26119",
"Oceana":"26127",
"Oscoda":"26135",
"Roscommon":"26143",
"Jackson":"27063",
"Otsego":"27137",
"Amite":"28005",
"Claiborne":"28021",
"Covington":"28031",
"Franklin":"28037",
"Grenada":"28043",
"Jackson":"28059",
"Jefferson Davis":"28065",
"Lamar":"28073",
"Lowndes":"28087",
"Newton":"28101",
"Perry":"28111",
"Simpson":"28127",
"Stone":"28131",
"Wayne":"28153",
"Crawford":"29055",
"Iron":"29093",
"Reynolds":"29179",
"Washington":"29221",
"Big Horn":"30003",
"Carbon":"30009",
"Chouteau":"30015",
"Daniels":"30019",
"Fallon":"30025",
"Gallatin":"30031",
"Glacier":"30035",
"Hill":"30041",
"McCone":"30055",
"Petroleum":"30069",
"Pondera":"30073",
"Prairie":"30079",
"Roosevelt":"30085",
"Sheridan":"30091",
"Toole":"30101",
"Valley":"30105",
"Wibaux":"30109",
"Cheyenne":"31033",
"Hayes":"31085",
"Kimball":"31105",
"Churchill":"32001",
"Esmeralda":"32009",
"Humboldt":"32013",
"Lincoln":"32017",
"Mineral":"32021",
"Pershing":"32027",
"White Pine":"32033",
"Chaves":"35005",
"Curry":"35009",
"Eddy":"35015",
"Harding":"35021",
"Lea":"35025",
"Otero":"35035",
"Rio Arriba":"35039",
"Sandoval":"35043",
"Union":"35059",
"Chemung":"36015",
"Steuben":"36101",
"Bottineau":"38009",
"Burke":"38013",
"Dunn":"38025",
"McKenzie":"38053",
"Mercer":"38057",
"Oliver":"38065",
"Slope":"38087",
"Ward":"38101",
"Athens":"39009",
"Hocking":"39073",
"Licking":"39089",
"Monroe":"39111",
"Perry":"39127",
"Stark":"39151",
"Washington":"39167",
"Atoka":"40005",
"Beckham":"40009",
"Caddo":"40015",
"Cherokee":"40021",
"Coal":"40029",
"Custer":"40039",
"Ellis":"40045",
"Garvin":"40049",
"Grant":"40053",
"Harper":"40059",
"Hughes":"40063",
"Kay":"40071",
"Latimer":"40077",
"Lincoln":"40081",
"McIntosh":"40091",
"Oklahoma":"40109",
"Pittsburg":"40121",
"Pushmataha":"40127",
"Sequoyah":"40135",
    "40141":"man",   // bugs but this ifor proof of concert
"40149":"ita",
"40151":"s",
"Woodward":"40153",
"Lake":"41037",
"Bedford":"42009",
"Forest":"42053",
"Jefferson":"42065",
"Westmoreland":"42129",
"Douglas":"46043",
"Harding":"46063",
"Brazos":"48041",
"Dallam":"48111",
"DeWitt":"48123",
"Fayette":"48149",
"Galveston":"48167",
"Grayson":"48181",
"Hemphill":"48211",
"Hill":"48217",
"Jackson":"48239",
"Karnes":"48255",
"Live Oak":"48297",
"Montague":"48337",
"Nacogdoches":"48347",
"Parker":"48367",
"Sabine":"48403",
"San Jacinto":"48407",
"Starr":"48427",
"Taylor":"48441",
"Trinity":"48455",
"Washington":"48477",
"Wise":"48497",
"Beaver":"49001",
"Daggett":"49009",
"Emery":"49015",
"Grand":"49019",
"Juab":"49023",
"Piute":"49031",
"Sanpete":"49039",
"Summit":"49043",
"Uintah":"49047",
"Dickenson":"51051",
"Lewis":"53041",
"Braxton":"54007",
"Lewis":"54041",
"Pendleton":"54071",
"Preston":"54077",
"Tucker":"54093",
"Wyoming":"54109",
"Big Horn":"56003",
"Carbon":"56007",
"Crook":"56011",
"Goshen":"56015",
"Johnson":"56019",
"Lincoln":"56023",
"Niobrara":"56027",
"Platte":"56031",
"Sublette":"56035",
"Uinta":"56041",
"Weston":"56045"
}



