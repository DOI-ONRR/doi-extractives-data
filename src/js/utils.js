import * as d3 from 'd3'
import slugify from 'slugify'
import currencyFormatter from 'currency-formatter'

// Import Display Name Yaml Files
import commodityNames from '../data/commodity_names.yml'

const extentPercent = 0.05
const extentMarginOfError = 0.10

const utils = {
  scrollStop: callback => {
    // Make sure a valid callback was provided
    if (!callback || typeof callback !== 'function') return

    // Setup scrolling variable
    let isScrolling

    // Listen for scroll events
    window.addEventListener('scroll', function (event) {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling)

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(function () {
        // Run the callback
        callback()
      }, 66)
    }, false)
  },
  getDisplayName_CommodityName: key => {
    return commodityNames[key] || key
  },

  formatToSlug: name => {
    return slugify(name, { lower: true, remove: /[$*_+~.()'"!\:@,?]/g }).replace('-and-', '-')
  },

  formatToDollarInt: value => {
    return currencyFormatter.format(value, { symbol: '$', precision: 0, format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' } })
  },

  formatToDollarFloat: (value, precision) => {
    return currencyFormatter.format(value, { symbol: '$', precision: precision, format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' } })
  },

  formatToCommaInt: value => {
    return currencyFormatter.format(value, { symbol: '', precision: 0, format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' } })
  },
  throttle: (callback, limit) => {
	    let wait = true // Initially, we're not waiting
	    return function () { // We return a throttled function
	        if (wait) { // If we're not waiting
	            wait = false // Prevent future invocations
	            setTimeout(function () { // After a period of time
	                callback.call() // Execute users function
	                wait = true						// And allow future invocations
	            }, limit)
	        }
	    }
  },
  groupBy (data, group) {
    let groups = {}

    data.map((item, index) => {
      let itemGroup = ''

      if (Array.isArray(group)) {
        group.forEach((entry, index) => {
          itemGroup += this.resolveByStringPath(entry, item) + '_'
        })
        itemGroup = itemGroup.slice(0, -1)
      }
      else {
        itemGroup = this.resolveByStringPath(group, item)
      }

      let list = groups[itemGroup]

      if (list) {
        list.push(item)
      }
      else {
        groups[itemGroup] = [item]
      }
    })

    return groups
  },
  sumBy (data, property) {
    let value = 0

    data.map((item, index) => {
      let propertyValue = this.resolveByStringPath(property, item)
      if (!isNaN(propertyValue)) {
        value += propertyValue
      }
    })

    return value
  },
  resolveByStringPath (path, obj) {
	    return path.split('.').reduce(function (prev, curr) {
	        return prev ? prev[curr] : undefined
	    }, obj || self)
  },
  range (start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  },
  round (number, precision) {
	    precision = precision || 0
	    return parseFloat(number).toFixed(precision)
  },
  formatToSigFig_Dollar (value, precision) {
    let num = d3.format(`.${precision}s`)(value)
    //let num = d3.format(setSigFigs(value, value))(value)
    
    let suffix = num.substring((num.length - 1))
    let dollarNum = this.formatToDollarFloat(num, (precision-1))

    return this.getMetricLongUnit(dollarNum+suffix)
  },
  getMetricLongUnit (str) {
    let suffix = { k: 'k', M: ' million', G: ' billion' }

    return str.replace(/[kMG]/g, match => {
    	return suffix[match] || match
    })
  },
  hashLinkScroll () {
  	const scrollToElement = () => {
	    const { hash } = window.location
	    if (hash !== '') {
	      // Push onto callback queue so it runs after the DOM is updated,
	      // this is required when navigating from a different page so that
	      // the element is rendered on the page before trying to getElementById.
	      setTimeout(() => {
	        const id = hash.replace('#', '')
	        const element = document.getElementById(id)
	        if (element) element.scrollIntoView()
	      }, 0)
	    }
  	}
    if(typeof window !== 'undefined') {
      window.addEventListener('load', scrollToElement)
    }
  },
  toTitleCase (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  },
}

export default utils

/**
 * This is a format transform that turns a value
 * into its si equivalent
 *
 * @param {String} str the formatted string
 * @return {String} the string with a specified number of significant figures
 */
let siValue = (function () {
  let suffix = { k: 1000, M: 1000000, G: 1000000000 }
  return function (str) {
    let number
    str = str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
      number = str.replace(s, '').toString() || str
      return (+number * suffix[s])
    }).replace(/\.0+$/, '')
    if (number) {
      return str.slice(number.length, str.length)
    }
    else {
      return str
    }
  }
})()

let crawlCeil = function (ymax, ceilMax, i) {
  // When ymax is a value less than 10, the ratio of ceilMax and ymax will never
  // be less than (1 + extentMarginOfError + extentPercent), and the function will continue
  // be called in its parent function's while loop.

  let sigFig = '.' + i + 's'

  /* var sigFigCeil = +eiti.format.transform(
    sigFig,
    eiti.format.siValue
  )(ceilMax); */

  let sigFigCeil = siValue(d3.format(sigFig)(ceilMax))

  let ceilIsLargerThanValue = sigFigCeil > +ymax
  let ceilIsntTooBig = (sigFigCeil / +ymax) <= (1 + extentMarginOfError + extentPercent)
  if (!ceilIsntTooBig) {
    ceilIsntTooBig = ((sigFigCeil - ymax) < 10) // Accomodate for small numbers if the difference is smal then this should be acceptable
  }
  let justRight = ceilIsLargerThanValue && ceilIsntTooBig
  return justRight ? sigFig : ''
}

/**
 * This function formats a number as the number of significant digits
 * with its amount (e.g. M for million, K for thousand, etc) abbreviation
 * For example:
 * 1,000,000 formats to 1M
 * @param {Number} ymax
 * @param {Number} ceilMax ymax + extent of the data set
 */
var setSigFigs = function (ymax, ceilMax) {
  let sigFigs = ''
  let SF = 0
  while (sigFigs.length < 3) {
    SF++
    sigFigs = crawlCeil(ymax, ceilMax, SF)
  }
  return sigFigs
}
