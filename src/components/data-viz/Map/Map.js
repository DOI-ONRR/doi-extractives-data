import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
import { withPrefixSVG, withPrefix } from '../../utils/temp-link'

const Map = (props) => {
/*   var width = 900;
      var height = 600;

      var projection = d3.geo.mercator();
      
      var svg = d3.select("#map-d3").append("svg")
          .attr("width", width)
          .attr("height", height);
    var path = d3.geo.path()
        .projection(projection);
    var g = svg.append("g");
    
    d3.json("world-110m2.json", function(error, topology) {
        g.selectAll("path")
            .data(topojson.object(topology, topology.objects.countries)
                  .geometries)
            .enter()
            .append("path")
            .attr("d", path)
    }); 
*/
    

    const elemRef = useRef(null);

    
    useEffect( () => {
     var width = 900;
     var height = 600;
     let us= new Object
     let promise = d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json")
	 .then( us => {
	     console.log(us);
	     let data;
	     let p= get_data().then((data)=>{
		 console.debug(data)
		 chart(elemRef.current, us,data);
	     });
	     
	     //
	 });
 
 

	   
     
 })  //use effect
  return (
	  <div ref={elemRef} >
	  </div>
  )
}

export default Map


const ramp = (color, n = 512) => {
    const canvas = DOM.canvas(n, 1);
    const context = canvas.getContext("2d");
    canvas.style.margin = "0 -14px";
    canvas.style.width = "calc(100% + 28px)";
    canvas.style.height = "40px";
    canvas.style.imageRendering = "pixelated";
    for (let i = 0; i < n; ++i) {
	context.fillStyle = color(i / (n - 1));
	context.fillRect(i, 0, 1, 1);
    }
    return canvas;
    
}



const chart = (node,us,data) => {
    const width = 960;
    const height = 600;
    const path = d3.geoPath();
    const color = d3.scaleSequentialQuantile(data.values, t => d3.interpolateBlues(t));

    console.debug(color);

    let format = d => { return "$" + d3.format(",.0f")(d); } 
  
    const svg = d3.select(node).append('svg')
      .style("width", "100%")
      .style("height", "auto")
      .attr("fill", "#E0E2E3");

  svg.append("g")
      .attr("transform", "translate(600,40)")
      .call(legend);


    console.log(us);
    
  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
	.attr("fill", d => color(data.get(d.id)))
      .attr("d", path)
      .attr("stroke", "#CACBCC")
    .append("title")
	.text( d=>`${d.properties.name} County` );
    //      .text(d => `${d.properties.name} County, ${states.get(d.id.slice(0, 2)).name}
// ${format(data.get(d.id))}`);
/*
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "#9FA0A1")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  return svg.node();

*/


}




const legend = (g,title) => {
  
  const width = 240;
  
  g.append("image")
      .attr("width", width)
      .attr("height", 8)
      .attr("preserveAspectRatio", "none")
	.attr("xlink:href", "www.google.com");
  
   g.append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
	.attr("font-weight", "bold")

	.text(title);



  g.call(d3.axisBottom(d3.scalePoint(["lowest", "median", "highest"], [0, width]))
      .tickSize(13))
    .select(".domain")
      .remove();

}



const get_data = async ()=> {
    let data= await d3.csv("https://raw.githubusercontent.com/rentry/rentry.github.io/master/data/revenue-test.csv", ({id, rate}) => [id, +rate]).then( (d) => {
	console.debug(d);
	let r={values:[],title:"Title", keyValues: {} }
	for(let ii=0; ii< d.length; ii++) {
	    r.values.push(d[ii][1]);
	    r.keyValues[d[ii][0]]=d[ii][1];
	}
	r.get = (id) => {return r.keyValues[id]};
	return r;
    });
    console.debug(data);
    return data;
}


