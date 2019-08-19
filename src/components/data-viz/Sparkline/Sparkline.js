import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styles from './Sparkline.module.scss'

const Sparkline = ({ data }) => {
  const spakeStyles = {
    // stroke: '#5c737f',
    // strokeWidth: 1,
    // fill: 'none',
  }

  const elemRef = useRef(null)

  useEffect(() => {
    let width = 85
    let height = 20
    let x = d3.scaleLinear().range([0, width - 3])
    let y = d3.scaleLinear().range([height - 4, 0])
    let line = d3.line()
      .curve(d3.curveBasis)
      .x(function (d) {
        return x(d.year)
      })
      .y(function (d) {
        return y(d.amount)
      })

    x.domain(d3.extent(data, function (d) {
      return +d.year
    }))
    y.domain(d3.extent(data, function (d) {
      return +d.amount
    }))

    d3.select(elemRef.current).selectAll('*').remove()

    let svg = d3.select(elemRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('height', (height + 2))
      .append('g')
      .attr('transform', 'translate(0, 2)')
    svg.append('path')
      .datum(data)
      .attr('class', styles.sparkline)
      .attr('d', line)

    svg.append('circle')
      .attr('class', styles.sparkcircle)
      .attr('cx', x(data[data.length - 1].year))
      .attr('cy', y(data[data.length - 1].amount))
      .attr('r', 2.3)
  })

  return (
    <div style={spakeStyles} ref={elemRef}></div>
  )
}

export default Sparkline
