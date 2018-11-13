import * as d3 from 'd3';
import utils from '../../js/utils';

const extentPercent = 0.05;
const extentMarginOfError = 0.10;
const MAX_EXTENT_LINE_Y = 20;

const stackedBarChart = {

	create(el, props, state) {

		if(state === undefined) {
			return;
		}

		let self = this;

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

		// Find the min value of the data sets by adding up the all the data items in the each set
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

		let xAxisLabels = props.displayConfig && props.displayConfig.xAxisLabels;
		let styleMap = props.displayConfig && props.displayConfig.styleMap;
		let keys = (props.displayConfig && props.displayConfig.sortOrder) || self.getOrderedKeys(state);
		let units = (props.displayConfig && props.displayConfig.longUnits) || '';
		// if default selected in not passed in as a prop then select the last item
		let defaultSelected = props.defaultSelected || Object.keys(state[state.length-1])[0];
		let maxExtentValue = this.calculateExtentValue(maxValue);


		let barSize = 15; // Key stats req to set bar width to 15, this should be a prop

		let height = (el.clientHeight <= 0 )? 200 : el.clientHeight;
		let marginTop = 25;
		let marginBottom = (props.groups)? 55 : 40;
		let width = (el.clientWidth <= 0 )? 300 : el.clientWidth;


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
		let maxExtentGroup = svg.append("g").attr("id", "maxExtent");

		maxExtentGroup.append("text")
			.attr("width", width)
			.attr("x", width)
			.attr("y", (MAX_EXTENT_LINE_Y-5))
			.attr("text-anchor", "end")
			.text((units === '$')? [units,maxExtentValue].join('') : [maxExtentValue,units].join(' '));

		maxExtentGroup.append("line")
      .attr('x1', 0)
      .attr('x2', width)
      .attr('stroke', '#a7bcc7')
      .attr('stroke-dasharray', [5,5])
      .attr('stroke-width', 1)
      .attr('transform', 'translate(' + [0, MAX_EXTENT_LINE_Y] + ')');

		// Create chart
		let stack = d3.stack()
		 	.keys(keys)
		 	.offset(d3.stackOffsetNone);

		svg.append("g")
			.attr("id", "bars")
			.selectAll("g")
			.data(state)
			.enter().append("g")
				.attr("height", (height-marginTop))
				.attr("width", xScale.bandwidth())
				.attr("transform", d => "translate("+(xScale(Object.keys(d)[0]))+",0)")
				.attr("selected", d => {
					if(Object.keys(d)[0] === defaultSelected){
						if(props.barSelectedCallback) {
							props.barSelectedCallback(d, this.findGroupNameByKey(props.groups, Object.keys(d)[0]) );
						}
						return true;
					}
				})
				.attr("class", d => (styleMap && styleMap.bar))
				.attr("data-key", d => Object.keys(d)[0])
				.on("click", function(d){toggleSelectedBar(this, d, props.barSelectedCallback, props.groups);})
				.selectAll("g")
				.data((d) => { return stack(d[Object.keys(d)[0]]); })
				.enter().append("g")
					.attr("class", (d) => styleMap && styleMap[d.key] )
					.append("rect")
					.attr("y", (d) => { return yScale(d[0][1]) || 0; })
					.attr("height", function(d) { return (yScale(d[0][0]) - yScale(d[0][1])) || 0; })
					.attr("width", barSize)
					.attr("x", barOffsetX);
 
 		// Create/Add x-axis
		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height-marginBottom) + ")")
		    .call(self.createXAxis(xScale, xAxisLabels))
		    .selectAll("text")
					.attr("y", 9);

		// Add Grouping Lines
		if(props.groups){
			let groupLines = svg.append("g").attr("id", "groups");
			let groupWidth = (width/state.length);
			let padding = (xScale.bandwidth()*0.2);
			let xPos = 0;

			Object.keys(props.groups).map((name, index) => {

					let width = xPos+(groupWidth*props.groups[name].length)-padding;

					groupLines.append("line")
			      .attr('x1', xPos+padding)
			      .attr('x2', width)
			      .attr('stroke', '#a7bcc7')
			      .attr('stroke-width', 1)
			      .attr('transform', 'translate(' + [0, height-4-marginBottom/2] + ')');

					groupLines.append("text")
						.attr("x", ((xPos+padding)/2)+(width/2) )
						.attr("y", height-16)
						.attr("text-anchor", "middle")
						.text(name);

			    xPos = width+padding;
				}
			);
		}


		// Redraw based on the new size whenever the browser window is resized.
      	//window.addEventListener("resize", utils.throttle(self.update.bind(self), 200));
	},

	update(el, props, state){
		if(state === undefined) {
			return;
		}

		let self = this;
		var svg = d3.select(el).select("svg");

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

		// Find the min value of the data sets by adding up the all the data items in the each set
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

		let xAxisLabels = props.displayConfig && props.displayConfig.xAxisLabels;
		let styleMap = props.displayConfig && props.displayConfig.styleMap;
		let keys = (props.displayConfig && props.displayConfig.sortOrder) || self.getOrderedKeys(state);
		let units = (props.displayConfig && props.displayConfig.longUnits) || '';
		// if default selected in not passed in as a prop then select the last item
		let defaultSelected = props.defaultSelected || Object.keys(state[state.length-1])[0];
		


		let barSize = 15; // Key stats req to set bar width to 15, this should be a prop

		let height = (el.clientHeight <= 0 )? 215 : el.clientHeight;
		let marginTop = 25;
		let marginBottom = (props.groups)? 55 : 40;
		let width = (el.clientWidth <= 0 )? 300 : el.clientWidth;


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

		let maxExtentValue = this.calculateExtentValue(maxValue);
		svg.select("#maxExtent")
			.select("text")
			.text((units === '$')? [units,maxExtentValue].join('') : [maxExtentValue,units].join(' '))
			.attr("y", (MAX_EXTENT_LINE_Y -5));

		// Create chart
		let stack = d3.stack()
		 	.keys(keys)
		 	.offset(d3.stackOffsetNone);

		svg.selectAll("#bars").remove();

		svg.append("g")
			.attr("id", "bars")
			.selectAll("g")
			.data(state)
			.enter().append("g")
				.attr("height", (height-marginTop))
				.attr("width", xScale.bandwidth())
				.attr("transform", d => "translate("+(xScale(Object.keys(d)[0]))+",0)")
				.attr("selected", d => {
					if(Object.keys(d)[0] === defaultSelected){
						if(props.barSelectedCallback) {
							props.barSelectedCallback(d, this.findGroupNameByKey(props.groups, Object.keys(d)[0]) );
						}
						return true;
					}
				})
				.attr("class", d => (styleMap && styleMap.bar))
				.attr("data-key", d => Object.keys(d)[0])
				.on("click", function(d){toggleSelectedBar(this, d, props.barSelectedCallback, props.groups);})
				.selectAll("g")
				.data((d) => { return stack(d[Object.keys(d)[0]]); })
				.enter().append("g")
					.attr("class", (d) => styleMap && styleMap[d.key] )
					.append("rect")
					.attr("y", (d) => { return yScale(d[0][1]) || 0; })
					.attr("height", function(d) { return (yScale(d[0][0]) - yScale(d[0][1])) || 0; })
					.attr("width", barSize)
					.attr("x", barOffsetX);

 
 		// Create/Add x-axis
 		svg.selectAll("g.x.axis").remove();

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height-marginBottom) + ")")
		    .call(self.createXAxis(xScale, xAxisLabels))
		    .selectAll("text")
					.attr("y", 9);


		// Add Grouping Lines
		svg.selectAll("#groups").remove();

		if(props.groups){

			let groupLines = svg.append("g").attr("id", "groups");
			let groupWidth = (width/state.length);
			let padding = (xScale.bandwidth()*0.2);
			let xPos = 0;

			Object.keys(props.groups).map((name, index) => {
					let width = xPos+(groupWidth*props.groups[name].length)-padding;

					groupLines.append("line")
			      .attr('x1', xPos+padding)
			      .attr('x2', width)
			      .attr('stroke', '#a7bcc7')
			      .attr('stroke-width', 1)
			      .attr('transform', 'translate(' + [0, height-4-marginBottom/2] + ')');

					groupLines.append("text")
						.attr("x", ((xPos+padding)/2)+(width/2) )
						.attr("y", height-16)
						.attr("text-anchor", "middle")
						.text(name);

			    xPos = width+padding;
				}
			);
		}

	},

	destroy(el){
		//window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
	},

	findGroupNameByKey(groups, key){
		return (groups) ? Object.keys(groups).find(name => groups[name].includes(key) ) : undefined;
	},

	createXAxis(xScale, xAxisLabels){
		return d3.axisBottom(xScale).tickSize(0).tickFormat((d) => (xAxisLabels)? xAxisLabels[d] : d);
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

const toggleSelectedBar = (element, data, callBack, groups) => {
  let selectedElement = element.parentNode.querySelector("[selected=true]");

  if(selectedElement){
  	selectedElement.removeAttribute("selected");
  }

  let groupName;
  if(groups){
  	groupName = Object.keys(groups).find(name => groups[name].includes(Object.keys(data)[0]) );
  }

  element.setAttribute("selected", true);

  if(callBack){
  	callBack(data, groupName);
  }
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