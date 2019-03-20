import * as d3 from 'd3';
import utils from '../../js/utils';

const DEFAULT_HEIGHT = 200;
const MARGIN_BOTTOM = 40;
const MARGIN_BOTTOM_GROUPS = 55;
const MARGIN_TOP = 25;
const MAX_EXTENT_LINE_Y = 20;

const extentPercent = 0.05;
const extentMarginOfError = 0.10;

const stackedBarChart = {
	barOffsetX: 0,
	groups: undefined, 
	height: DEFAULT_HEIGHT,
	keys: undefined,
	maxBarSize: undefined,
	marginBottom: MARGIN_BOTTOM,
	marginTop: MARGIN_TOP,
	maxValue: undefined,
	styleMap: undefined,

	init(el, props, state) {
		this.state = state;

		this.selectedDataKey = props.selectedDataKey;
		this.keys = props.sortOrder || this.getOrderedKeys(state);
		this.groups = props.groups;
		this.height = (el.clientHeight > 0 )? el.clientHeight : DEFAULT_HEIGHT;
		// if we have grouping labels we need more room on the bottom
		this.marginBottom = (props.groups)? MARGIN_BOTTOM_GROUPS : MARGIN_BOTTOM;
		this.maxValue = this.calcMaxValue(this.state);

		this.styleMap = props.styleMap;

		this.units = props.units || '';

		this.width = (el.clientWidth <= 0 )? 300 : el.clientWidth;

		this.xScale = d3.scaleBand()
		    .domain(this.state.map(d => {return Object.keys(d)[0];}))
		    .range([0, this.width])
		    .paddingInner(0.3)
		    .paddingOuter(0.1);

		this.yScale = d3.scaleLinear().rangeRound([this.marginTop, this.height-this.marginBottom]);
		// For vetical bars we want start rect at the bottom and go to the top
		// SVG height goes down so this setting will reverse that
		this.yScale.domain([this.maxValue, 0]);

		this.maxBarSize = props.maxBarSize;
		if(this.maxBarSize) {
			this.barOffsetX = (this.xScale.bandwidth() > this.maxBarSize)? (this.xScale.bandwidth()-this.maxBarSize)/2 : 0;
			this.maxBarSize = d3.min([this.xScale.bandwidth(), this.maxBarSize]);
		}
		else{
			this.maxBarSize = this.xScale.bandwidth();
		}


	},

	create(el, props, state) {

		if(state === undefined) {
			return;
		}

		let self = this;

		// Initialize all chart attributes
		self.init(el, props, state);

		self.svg = d3.select(el).append('svg')
					.attr('height', self.height)
					.attr('width', self.width);

		self.addBackgroundRect(props);

		self.addMaxExtent(props);

		self.addChart(props);
 
		self.addXAxis(props);

		self.addGroupLines();


		// Redraw based on the new size whenever the browser window is resized.
      	//window.addEventListener("resize", utils.throttle(self.update.bind(self), 200));
	},

	update(el, props, state){
		if(state === undefined) {
			return;
		}

		let self = this;

		this.svg = d3.select(el).select("svg");

		// Initialize all chart attributes
		this.init(el, props, state);

		this.svg.selectAll("#backgroundRect").remove();
		this.addBackgroundRect(props);

		this.svg.selectAll("#maxExtent").remove();
		this.addMaxExtent(props);

		this.svg.selectAll("#bars").remove();
		this.addChart(props);


 		this.svg.selectAll("g.x.axis").remove();
		this.addXAxis(props);

		// Add Grouping Lines
		this.svg.selectAll("#groups").remove();
		this.addGroupLines();


	},

	destroy(el){
		//window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
	},

	getOrderedKeys(data) {
		return Object.keys((data[0][Object.keys(data[0])[0]])[0]);
	},
	// Find the max value of the data sets by adding up the all the data items in the each set
	calcMaxValue(state) {
		return d3.max(state, (d) => {
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
	},
	// Find the min value of the data sets by adding up the all the data items in the each set
	calcMinValue(state) {
		return d3.min(state, (d) => {
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
  },


	addMaxExtent(props){
		let self = this;
		// Add Max Extent Number text
		let maxExtentGroup = self.svg.append("g").attr("id", "maxExtent");
		let maxExtentValue = this.calculateExtentValue(this.maxValue);
		let units = props.units || '';

		maxExtentGroup.append("text")
			.attr("width", self.width)
			.attr("x", self.width)
			.attr("y", (MAX_EXTENT_LINE_Y-5))
			.attr("text-anchor", "end")
			.text((units === 'dollars' || units === '$')? ["$", maxExtentValue].join('') : [maxExtentValue, units].join(' '));

		maxExtentGroup.append("line")
      .attr('x1', 0)
      .attr('x2', self.width)
      .attr('stroke', '#a7bcc7')
      .attr('stroke-dasharray', [5,5])
      .attr('stroke-width', 1)
      .attr('transform', 'translate(' + [0, MAX_EXTENT_LINE_Y] + ')');
	},

	// Added this to help catch hover events. To make sure it got cleared when a bar is not hovered.
	addBackgroundRect(props) {
		let self = this;
		this.svg.append("rect")
			.on("mouseenter", function(){toggleHoveredBar(undefined, props.barHoveredCallback, false);})
			.on("mouseleave", function(){toggleHoveredBar(undefined, props.barHoveredCallback, false);})
			.attr("id", "backgroundRect")
			.style('opacity', 0.0)
			.attr("y", 0)
			.attr("height", self.height)
			.attr("width", self.width)
			.attr("x", 0);
	},

	addChart(props) {

		let self = this;

		// Create chart
		let stack = d3.stack()
		 	.keys(this.keys)
		 	.offset(d3.stackOffsetNone);

		this.svg.append("g")
			.attr("id", "bars")
			.selectAll("g")
			.data(self.state)
			.enter().append("g")
				.attr("height", (self.height - self.marginTop))
				.attr("width", self.xScale.bandwidth())
				.attr("transform", d => "translate("+(self.xScale(Object.keys(d)[0]))+",0)")
				.attr("selected", d => Object.keys(d)[0] === self.selectedDataKey )
				.attr("class", d => (self.styleMap && self.styleMap.bar))
				.attr("data-key", d => Object.keys(d)[0])
				.on("click", function(d){toggleSelectedBar(this, d, props.barSelectedCallback);})
				.on("touchstart", function(d){d3.event.preventDefault(); toggleSelectedBar(this, d, props.barSelectedCallback);})
				.on("mouseenter", function(d){toggleHoveredBar(d, props.barHoveredCallback, true);})
				.on("mouseleave", function(d){toggleHoveredBar(d, props.barHoveredCallback, false);})
				.selectAll("g")
				.data((d) => { return stack(d[Object.keys(d)[0]]); })
				.enter().append("g")
					.attr("class", (d) => self.styleMap && self.styleMap[d.key] )
					.append("rect")
					.attr("y", (d) => { return self.yScale(d[0][1]) || 0; })
					.attr("height", function(d) { return (self.yScale(d[0][0]) - self.yScale(d[0][1])) || 0; })
					.attr("width", self.maxBarSize)
					.attr("x", self.barOffsetX);

	},

	addXAxis(props) {
		let self = this;

		let createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat((d) => 
				(props.xAxisLabels)? props.xAxisLabels[d] : d) );

		self.svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (self.height-self.marginBottom) + ")")
		    .call(createXAxis())
		    .selectAll("text")
					.attr("y", 9);
	},

	addGroupLines() {
		if(this.groups){
			let self = this;

			let groupLines = this.svg.append("g").attr("id", "groups");
			let groupItemWidth = (self.width/self.state.length);
			let padding = (self.xScale.bandwidth()*0.2);
			let xPos = 0;

			Object.keys(self.groups).map((name, index) => {

					let groupLineWidth = xPos+(groupItemWidth*self.groups[name].length)-padding;

					groupLines.append("line")
			      .attr('x1', xPos+padding)
			      .attr('x2', groupLineWidth)
			      .attr('stroke', '#a7bcc7')
			      .attr('stroke-width', 1)
			      .attr('transform', 'translate(' + [0, self.height-4-self.marginBottom/2] + ')');

					groupLines.append("text")
						.attr("x", ((xPos+padding)/2)+(groupLineWidth/2) )
						.attr("y", self.height-16)
						.attr("text-anchor", "middle")
						.text(name);

			    xPos = groupLineWidth+padding;
				}
			);
		}
	},

}

const toggleSelectedBar = (element, data, callBack) => {
  let selectedElement = element.parentNode.querySelector("[selected=true]");

  if(selectedElement){
  	selectedElement.removeAttribute("selected");
  }

  element.setAttribute("selected", true);

  if(callBack){
  	callBack(data);
  }
}

const toggleHoveredBar = (data, callBack, isHover) => {
  if(callBack){
  	callBack(data, isHover);
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