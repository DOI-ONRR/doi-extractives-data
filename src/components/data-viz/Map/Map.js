import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
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
    
 useEffect(() => {
     var width = 900;
      var height = 600;

     console.debug(withPrefixSVG());
     
     d3.select(elemRef.current)
	 .append('h5')
	 .append('text')
	 .text(`D3 version: ${d3.version}`)
 })
  return (
	  <div ref={elemRef} >
	  <svg viewBox="22 60 936 525"> 
	  <use xlinkHref={withPrefixSVG('/maps/states/all.svg') + '#states'}></use>
	  </svg>
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
