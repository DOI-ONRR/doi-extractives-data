import * as d3 from 'd3'
import utils from '../../js/utils'
/**
 *
 **/
const stackedBar = {
  create (el, props, state) {
    let self = this

    let svg = d3.select(el).append('svg')
      .attr('height', props.height)
      .attr('width', el.clientWidth)

    let stack = d3.stack()
      .keys(self.getOrderedKeys(props.displayNames, state))
      .offset(d3.stackOffsetNone)

    let series = stack(state)

    let xScale = d3.scaleLinear().rangeRound([0, el.clientWidth])

    if (props.maxValue) {
      xScale.domain([0, props.maxValue])
    }
    else {
      xScale.domain([0, d3.max(series[series.length - 1], function (d) {
        return d[1]
      }) ])
    }

    svg.selectAll('g')
      .data(series)
      .enter().append('g')
      .attr('class', d => {
        return self.getKeyClassName(d.key)
      })
      .append('rect')
      .attr('x', d => {
        return xScale(d[0][0])
      })
      .attr('height', props.height)
      .attr('width', function (d) {
        return xScale(d[0][1]) - xScale(d[0][0])
      })

    // Redraw based on the new size whenever the browser window is resized.
      	// window.addEventListener("resize", utils.throttle(self.update.bind(self), 200));
  },

  update (el, props, state) {
    let self = this

    let svg = d3.select(el).select('svg')

    let stack = d3.stack()
      .keys(self.getOrderedKeys(props.displayNames, state))
      .offset(d3.stackOffsetNone)

    let series = stack(state)

    let xScale = d3.scaleLinear().rangeRound([0, el.clientWidth])

    if (props.maxValue) {
      xScale.domain([0, props.maxValue])
    }
    else {
      xScale.domain([0, d3.max(series[series.length - 1], function (d) {
        return d[1]
      }) ])
    }

    let bars = svg.selectAll('g')
      .data(series)

    // Remove Bars that we dont need
    bars.exit()
      .remove('g')

    // Add new Bars
    bars.enter().append('g')
      .attr('class', d => {
        return self.getKeyClassName(d.key)
      })
      .append('rect')
      .attr('x', d => {
        return xScale(d[0][0])
      })
      .attr('height', props.height)
      .attr('width', function (d) {
        return xScale(d[0][1]) - xScale(d[0][0])
      })

    // Update existing Bars
    bars.transition()
      .duration(0)
      .attr('class', d => {
        return self.getKeyClassName(d.key)
      })
      .select('rect')
      .attr('x', d => {
        return xScale(d[0][0])
      })
      .attr('height', props.height)
      .attr('width', function (d) {
        return xScale(d[0][1]) - xScale(d[0][0])
      })
  },

  destroy (el) {
    // window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
  },

  getKeyClassName (key) {
    return ('stacked-bar-' + utils.formatToSlug(key))
  },

  getOrderedKeys (displayNames, state) {
    let orderedKeys = []
    if (displayNames) {
      for (let key in displayNames) {
        if (state[0][key]) {
          orderedKeys.push(key)
        }
      }
    }
    else {
      orderedKeys = Object.keys(state[0])
    }

    return orderedKeys
  }
}

export default stackedBar
