import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
import { withPrefixSVG, withPrefix } from '../../utils/temp-link'
import styles from './Map.module.scss'

/**
*  Map  a component for rendering maps dynamically from  data
*
*  @param {string} [mapJson="https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json"]  mapJson - url to get the topojson used in map. 
*  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
*  @param {string[][]} mapData - a two dimenstional arrray of fips and data, maybe county or state fips
*  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
*  @param {*} onClick function that determines what to do if area is clicked
*
*/
const Map = (props) => {
    // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
    //use ONRR topojson file for land
    const mapJson=props.mapJson || "/maps/land/us-topology.json";

    const mapFeatures=props.mapFeatures || "counties";
    const mapData=props.mapData || [];  
    const elemRef = useRef(null);
    const colorScheme=props.colorScheme || "green" ;
    const onClick=props.onClick || function (d,i) {console.debug("Default onClick function", d,i)};
    useEffect( () => {
     let us= new Object
	let promise = d3.json(mapJson)
	 .then( us => {
	     let states = get_states(us);
	     let data=observable_data(mapData);
//	     let p= get_data().then((data)=>{3
//		 chart(elemRef.current, us,mapFeatures,data);
//	     });

	     let propmise2=d3.json("maps/offshore/offshore.json")
		 .then( offshore => {

		     let max=data.values.sort((a,b)=>a-b)[data.values.length-1];

		     let fake_data=mapData;
		     let real_data={};
		     for(let region in  offshore.objects ) {
			 for(let ii =0; ii< offshore.objects[region].geometries.length; ii++) {
			     let value=Math.random() * 10000000 + max;
			     fake_data.push([ offshore.objects[region].geometries[ii].id,value]);
			 }
			 real_data=observable_data(fake_data);
		     }
		     let svg=chart(elemRef.current, us,mapFeatures,real_data, colorScheme,onClick);
		     for(let region in  offshore.objects ) {
		     offshore_chart(svg,offshore,region,real_data, colorScheme,onClick);
		     }
			     
		 })
	     //
	 });
 
 

	   
     
 })  //use effect
  return (
	  <div className={styles.map} ref={elemRef} >
          </div>
	  
  )
}

export default Map



/**
*  The function that does the building of the svg with d3
*
*  @param {*}  node - the node we are going to build the svg in
*  @param {*} us - the topojson json object to be used
*  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
*  @param {string[][]} data - a two dimenstional arrray of fips and data, maybe county or state fips
*  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
*  @param {*} onClick function that determines what to do if area is clicked
*
*/
const chart = (node,us,mapFeatures,data, colorScheme,onClick) => {
    
    const width = node.scrollWidth;
    const height = node.scrollHeight;
    const path = d3.geoPath();
    let color = ()=>{};
    // switch quick and dirty to let users change color beter to use d3.interpolateRGB??
    switch(colorScheme) {
    case 'blue':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateBlues(t));
	break;
    case 'green':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreens(t));
	break;
    case 'red':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateReds(t));
	break;
    case 'grey':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreys(t));
	break;
    default:
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreens(t));
    }
    let format = d => { if(isNaN(d)) {return "" } else {return "$" + d3.format(",.0f")(d);} } 
  
    const svg = d3.select(node).append('svg')
      .style("width", width)
      .style("height", height)
	  .attr("fill", "#E0E2E3")
	  //.attr("viewBox", '-40 0 '+width*1.8+' '+height*1.8);

  svg.append("g")
      .attr("transform", "translate(400,40)")
	.call(legend,data.title, data, color);


    let states = get_states(us);
    console.debug(states);
    console.debug(us);
    console.debug(us.objects[mapFeatures]);
    console.debug(topojson.feature(us, us.objects[mapFeatures]));
    svg.append("g").attr("transform", "translate(900,400) scale(5,-5)")
    
	.selectAll("path")
	.data(topojson.feature(us, us.objects[mapFeatures]).features)
	.join("path")
	.attr("fill", d => color(data.get(d.id)))
    	.attr("fill-opacity", .9)
    	.attr("d", path)
	.attr("stroke", "#CACBCC")
        .attr('vector-effect', 'non-scaling-stroke')
	.on("click", (d,i) => {onClick(d,i)} )
	.on("mouseover", function(d,i) {   // ES6 function find the this node is alluding me

	    d3.select(this).style('fill-opacity', .7); 
	})
    	.on("mouseout", (d,i) => {
	    d3.selectAll('path')
		.style('fill-opacity',.9)
	}
	)
	.append("title")
	.text(d => `${d.properties.name}  ${format(data.get(d.id))}`);
   
    svg.append("path")
	.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
	.attr("fill", "none")
	.attr("stroke", "#9FA0A1")
	.attr("stroke-linejoin", "round")
	.attr("d", path);
    
    return svg.node();
    




}



const offshore_chart = (node,offshore, region ,data, colorScheme,onClick) => {
    
    const path = d3.geoPath();
    let color = ()=>{};
    // switch quick and dirty to let users change color beter to use d3.interpolateRGB??
    switch(colorScheme) {
    case 'blue':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateBlues(t));
	break;
    case 'green':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreens(t));
	break;
    case 'red':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateReds(t));
	break;
    case 'grey':
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreys(t));
	break;
    default:
	color=d3.scaleSequentialQuantile(data.values, t => d3.interpolateGreens(t));
    }
    let format = d => { if(isNaN(d)) {return "" } else {return "$" + d3.format(",.0f")(d);} } 
  

    let svg=d3.select(node);

    svg.append("g").attr("transform", "translate(900,400) scale(5,-5)")
    
	.selectAll("path")
	.data(topojson.feature(offshore, offshore.objects[region]).features)
	.join("path")
	.attr("fill", d => color(data.get(d.id)))
    	.attr("fill-opacity", .9)
    	.attr("d", path)
	.attr("stroke", "#CACBCC")
        .attr('vector-effect', 'non-scaling-stroke')
	.on("click", (d,i) => {onClick(d,i)} )
	.on("mouseover", function(d,i) {   // ES6 function find the this node is alluding me

	    d3.select(this).style('fill-opacity', .7); 
	})
    	.on("mouseout", (d,i) => {
	    d3.selectAll('path')
		.style('fill-opacity',.9)
	}
	)
	.append("title")
	.text(d => `${d.properties.name}  ${format(data.get(d.id))}`);
   
    svg.append("path")
	.datum(topojson.mesh(offshore, offshore.objects[region], (a, b) => a !== b))
	.attr("fill", "none")
	.attr("stroke", "#9FA0A1")
	.attr("stroke-linejoin", "round")
	.attr("d", path);
    
    return svg.node();
    




}




/**
*  The function that does the building of the svg with d3
*
*  @param {*}  g - the group node we are going to build the legend in
*  @param {string} title - the title of the map
*  @param {string[][]} data - a two dimenstional arrray of fips and data, maybe county or state fips used to generate legend colors
*  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
*
*/



const legend = (g,title,data,color) => {
/*

    g.append("rect")
	.attr("x", 200)
	.attr("y", 300)
	.attr("width", ls_w)
	.attr("height", ls_h)
	.style("fill", '#FF00FF')
	.style("opacity", 1);

    g.append("text")
	.attr("x", 50)
	.attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
	.text(function(d, i){ return "label "+i });
*/
    const width = 240;
    const height= 15;
    let sorted=data.values.sort((a,b)=>a-b);
    let lowest=Math.floor(sorted[0]);
    let median=Math.floor(sorted[Math.floor(sorted.length/2)]);
    let highest=Math.floor(sorted[sorted.length-1]);
    for(let ii=0;ii<sorted.length; ii++) {
	g.append("rect")
	    .attr("x",ii*width/sorted.length)
	    .attr("width",width/sorted.length+1)
 	    .attr("height",height)
	    .style("fill", color(sorted[ii]))
    }
  	
   g.append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
	.attr("font-weight", "bold")

	.text(title);



  g.call(d3.axisBottom(d3.scalePoint([lowest, median, highest], [0, width]))
      .tickSize(13))
    .select(".domain")
      .remove();

}

/**
*  The function that mimics Observable Map() funtcion to allow minimal change to prototype. 
*
*  @param {array[][]}  d - two diminational array of data
*  @return {object} returns an object with values as an array keys as an array and a get accessor for getting the data
*
*/


const observable_data = (d)=> {
//    let data= await d3.csv("https://raw.githubusercontent.com/rentry/rentry.github.io/master/data/revenue-test.csv", ({id, rate}) => [id, +rate]).then( (d) => {
	let r={values:[],title:"Title", keyValues: {} }
	for(let ii=0; ii< d.length; ii++) {
	    r.values.push(d[ii][1]);
	    r.keyValues[d[ii][0]]=d[ii][1];
	}
	r.get = (id) => {return r.keyValues[id]};
	return r;

}

/**
*  The function that mimics Observable Map() funtcion for topojson data
*
*  @param {object}  us - topojson data object
*  @return {object} returns an object with values as an array keys as an array and a get accessor for getting the data
*
*/


const get_states = (us)=> {
    let r={values: [] , keys: [], keyValues: {}};
    for(let key in  us.objects.states.geometries) {
	let state= us.objects.states.geometries[key];
	let id=state.id;


	let value=state.properties.name;

	r.values.push(value);
	r.keys.push(id);
	r.keyValues[id]={id:id,name:value};
	
	

	
    }
    r.get = (id) => { return r.keyValues[id]};
    return r;

}


