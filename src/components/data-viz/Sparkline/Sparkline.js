import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import utils from '../../../js/utils'


const Sparkline = ({data}) => {

  const spakeStyles = {
    stroke: 'steelblue',
    strokeWidth: 1,
    fill: 'none',
  }

  const elemRef = useRef(null);

  useEffect(() => {
    var width = 75;
    var height = 20;
    var x = d3.scaleLinear().range([0, width - 3]);
    var y = d3.scaleLinear().range([height - 4, 0]);
    var line = d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d) { return x(d.year); })
                 .y(function(d) { return y(d.amount); });

    x.domain(d3.extent(data, function(d) { return +d.year; }));
    y.domain(d3.extent(data, function(d) { return +d.amount; }));
    var svg = d3.select(elemRef.current)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('height', (height+2))
                .append('g')
                .attr('transform', 'translate(0, 2)');
    svg.append('path')
       .datum(data)
       .attr('class', 'sparkline')
       .attr('d', line);
    svg.append('circle')
       .attr('class', 'sparkcircle')
       .style('fill', 'steelblue')
       .attr('cx', x(data[data.length - 1].year))
       .attr('cy', y(data[data.length - 1].amount))
       .attr('r', 1);  
  });

  return (
    <div style={spakeStyles} ref={elemRef}></div>
  )
}

export default Sparkline