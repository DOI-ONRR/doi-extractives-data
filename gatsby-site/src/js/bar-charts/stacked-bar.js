import * as d3 from 'd3';
import utils from 'js/utils';
/**
 *  
 **/
const stackedBar = {
	create(el, props, state) {

		//console.log(state);
		//console.log(props.keys);
		//console.log(props.keysClassNames);

		let width = el.clientWidth;
		let height = props.height;

		let xScale = d3.scaleLinear().rangeRound([0, width]);

		var svg = d3.select(el).append('svg')
					.attr('height', height)
					.attr('width', width);

		var stack = d3.stack()
			.keys(props.keys)
			.offset(d3.stackOffsetNone);

		var series = stack(state);

		//console.log(props.chartDataMaxValue);
		//console.log(d3.max(series[series.length - 1], function(d) { console.log(d); return d[1]; }));

		if(props.chartDataMaxValue){
			xScale.domain([0, props.chartDataMaxValue]).nice();
		}
		else{
			xScale.domain([0, d3.max(series[series.length - 1], function(d) { console.log(d); return d[1]; }) ]).nice();
		}

		

		var layer = svg.selectAll(".layer")
			.data(series)
			.enter().append("g")
			.attr("class", function(d, i){ return (props.keysClassNames[d.key] : ""); });

		layer.selectAll("rect")
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", function(d) { return xScale(d[0]); })
			.attr("height","50px")
			.attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });
		      
		// Redraw based on the new size whenever the browser window is resized.
      	window.addEventListener("resize", utils.throttle(this.update.bind(this), 200));
	},

	update(el, state){
		//console.log("Stacked Bar Update");
		//var layers = stack(state);

		//console.log(layers[layers.length - 1]);
	},

	destroy(el){
		window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
	},
}

export default stackedBar;