import * as d3 from 'd3';
import 'core-js'; /* used for IE 11 compatibility */
import utils from '../../js/utils';

const extentPercent = 0.05;
const extentMarginOfError = 0.10;

const stackedBarChart = {
	create(el, props, state) {

		if(state === undefined) {
			return;
		}
		
		// Find the max value of the data sets by adding up the all the data items in the each set
		let maxValue = d3.max(state, (d) => {
			let sum = 0;
			Object.entries(d).forEach(
			    ([key, values]) => {
		    		Object.entries(values[0]).forEach(
			    		([key, value]) => {
			    			sum += value;
			    		}
			    	)
			    }
			)
			return (sum);
		});

		// Find the max value of the data sets by adding up the all the data items in the each set
		let minValue = d3.min(state, (d) => {
			let data = 0;
			Object.entries(d).forEach(
			    ([key, values]) => {
		    		Object.entries(values[0]).forEach(
			    		([key, value]) => {
			    			data += value;
			    		}
			    	)
			    }
			)
			return (data);
		});

		let units = props.units || '';
		let maxExtentValue = this.calculateExtentValue(maxValue);

		let self = this;

		let barSize = 15; // Key stats req to set bar width to 15, this should be a prop

		let height = (el.clientHeight <= 0 )? 200 : el.clientHeight;
		let marginTop = 25;
		let marginBottom = 40;
		let width = (el.clientWidth <= 0 )? 300 : el.clientWidth;

		let keys = props.displayNames || self.getOrderedKeys(state);

		let yScale = d3.scaleLinear().rangeRound([marginTop,height-marginBottom]);
		// For vetical bars we want start rect at the bottom and go to the top
		// SVG height goes down so this setting will reverse that
		yScale.domain([maxValue, 0]);

		let xScale = d3.scaleBand()
		    .domain(state.map(d => {return Object.keys(d)[0];}))
		    .range([0, width])
		    .paddingInner(0.3)
		    .paddingOuter(0.1);

		let barOffsetX = 0;

		if(barSize) {
			barOffsetX = (xScale.bandwidth() > barSize)? (xScale.bandwidth()-barSize)/2 : 0;
			barSize = d3.min([xScale.bandwidth(), barSize]);
		}

		let svg = d3.select(el).append('svg')
					.attr('height', height)
					.attr('width', width);

		// Add Max Extent Number text
		let maxExtentLineY = 20;
		let maxExtentGroup = svg.append("g");

		maxExtentGroup.append("text")
			.attr("width", width)
			.attr("x", width)
			.attr("y", (maxExtentLineY-5))
			.attr("text-anchor", "end")
			.text((units === '$')? [units,maxExtentValue].join('') : [maxExtentValue,units].join(' '));

		maxExtentGroup.append("line")
      .attr('x1', 0)
      .attr('x2', width)
      .attr('stroke', '#a7bcc7')
      .attr('stroke-dasharray', [5,5])
      .attr('stroke-width', 1)
      .attr('transform', 'translate(' + [0, maxExtentLineY] + ')');

		// Create chart
		let stack = d3.stack()
		 	.keys(keys)
		 	.offset(d3.stackOffsetNone);

		svg.append("g")
			.selectAll("g")
			.data(state)
			.enter().append("g")
				.attr("height", (height-marginTop))
				.attr("width", xScale.bandwidth())
				.attr("transform", d => "translate("+(xScale(Object.keys(d)[0]))+",0)")
				.attr("class", d => 
					(Object.keys(d)[0] === props.defaultSelected)? 
						props.barClassNames+" "+props.barSelectedClassNames : props.barClassNames)
				.attr("data-key", d => Object.keys(d)[0])
				.on("click", function(d){toggleSelectedBar(this, d, props.barSelectedClassNames, props.barSelectedCallback);})
				.selectAll("g")
				.data((d) => { return stack(d[Object.keys(d)[0]]); })
				.enter().append("g")
					.attr("class", (d) =>{ return self.getKeyClassName(props.classNamesMap, d.key); })
					.append("rect")
					.attr("y", (d) => { return yScale(d[0][1]); })
					.attr("height", function(d) { return yScale(d[0][0]) - yScale(d[0][1]); })
					.attr("width", barSize)
					.attr("x", barOffsetX);
 
 		// Create/Add x-axis
		let xAxis = d3.axisBottom(xScale).tickSize(0);

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height-marginBottom) + ")")
		    .call(xAxis)
		    .selectAll("text")
					.attr("y", 9);

		// Add Grouping Lines
		if(props.groups){
			let groupLines = svg.append("g");
			let groupWidth = (width/12);
			let padding = (xScale.bandwidth()*0.2);
			let xPos = 0;

			props.groups.map((group, index) => {
					if(index !== -1) {

						let width = xPos+(groupWidth*group.members)-padding;

						groupLines.append("line")
				      .attr('x1', xPos+padding)
				      .attr('x2', width)
				      .attr('stroke', '#a7bcc7')
				      .attr('stroke-width', 1)
				      .attr('transform', 'translate(' + [0, height-15] + ')');

						groupLines.append("text")
							.attr("x", ((xPos+padding)/2)+(width/2) )
							.attr("y", height)
							.attr("text-anchor", "middle")
							.text(group.name);

				    xPos = width+padding;
					}

				}
			);
		}


		// Redraw based on the new size whenever the browser window is resized.
      	//window.addEventListener("resize", utils.throttle(self.update.bind(self), 200));
	},

	update(el, props, state){
		console.log(el.clientWidth);

	},

	destroy(el){
		//window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
	},
	
	getKeyClassName(classNamesMap, key) {
		if(classNamesMap) {
			return classNamesMap[key]
		}
		else {
			return utils.formatToSlug(key);
		}
	},

	getOrderedKeys(data) {
		return Object.keys((data[0][Object.keys(data[0])[0]])[0]);
	},

	getMetricLongUnit(str) {
    var suffix = {k: 'k', M: ' million', G: ' billion'};

    return str.replace(/(\.0+)?([kMG])$/, function(_, zeroes, s) {
        return suffix[s] || s;
      });
  },

  calculateExtentValue(maxValue) {
  	let maxValueExtent = Math.ceil(maxValue * (1+extentPercent));
  	return this.getMetricLongUnit(d3.format(setSigFigs(maxValue, maxValueExtent))(maxValueExtent));
  }
}

const toggleSelectedBar = (element, data, classNames, callBack) => {
  let allBars = element.parentNode.childNodes;

  allBars.forEach(bar => bar.classList.remove(classNames))
  element.classList.add(classNames);
}


/**
 * This is a format transform that turns a value
 * into its si equivalent
 *
 * @param {String} str the formatted string
 * @return {String} the string with a specified number of significant figures
 */
var siValue = (function() {
  var suffix = {k: 1000, M: 1000000, G: 1000000000 };
  return function(str) {
    var number;
    str = str.replace(/(\.0+)?([kMG])$/, function(_, zeroes, s) {
      number = str.replace(s, '').toString() || str;
      return (+number * suffix[s]);
    }).replace(/\.0+$/, '');
    if (number) {
      return str.slice(number.length, str.length);
    } else {
      return str;
    }
  };
})();

var crawlCeil = function(ymax, ceilMax, i) {
  // When ymax is a value less than 10, the ratio of ceilMax and ymax will never
  // be less than (1 + extentMarginOfError + extentPercent), and the function will continue
  // be called in its parent function's while loop.

  var sigFig = '.' + i + 's';

 /* var sigFigCeil = +eiti.format.transform(
    sigFig,
    eiti.format.siValue
  )(ceilMax);*/

  let sigFigCeil = siValue(d3.format(sigFig)(ceilMax));
 
  var ceilIsLargerThanValue = sigFigCeil > +ymax;
  var ceilIsntTooBig = ( sigFigCeil / +ymax ) <= (1 + extentMarginOfError + extentPercent);
  if(!ceilIsntTooBig){
    ceilIsntTooBig = ((sigFigCeil - ymax) < 10); // Accomodate for small numbers if the difference is smal then this should be acceptable
  }
  var justRight = ceilIsLargerThanValue && ceilIsntTooBig;
  return justRight ? sigFig : '';
};

/**
 * This function formats a number as the number of significant digits
 * with its amount (e.g. M for million, K for thousand, etc) abbreviation
 * For example:
 * 1,000,000 formats to 1M
 * @param {Number} ymax
 * @param {Number} ceilMax ymax + extent of the data set
 */
var setSigFigs = function(ymax, ceilMax) {
  var sigFigs = '';
  var SF = 0;
  while (sigFigs.length < 3) {
    SF++;
    sigFigs = crawlCeil(ymax, ceilMax, SF);
  }
  return sigFigs;
};

export default stackedBarChart;