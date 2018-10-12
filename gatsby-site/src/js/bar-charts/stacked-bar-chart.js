import * as d3 from 'd3';
import utils from '../../js/utils';

const stackedBarChart = {
	create(el, props, state) {
		console.log(props);
		let self = this;

		let height = 200;
		let margin = 20;
		let width = 300;

		let keys = props.displayNames || self.getOrderedKeys(state);

		console.log(d3.permute(['08','09','10'], [0,1,2]));

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

		let yScale = d3.scaleLinear().rangeRound([0, (height-margin)]);
		// For vetical bars we want start rect at the bottom and go to the top
		// SVG height goes down so this setting will reverse that
		yScale.domain([maxValue, 0]).nice();


		let xScale = d3.scaleBand()
		    .domain(state.map(d => {return Object.keys(d)[0];}))
		    .range([0, width])
		    .paddingInner(0.3)
		    .paddingOuter(0.1);

		let svg = d3.select(el).append('svg')
					.attr('height', height)
					.attr('width', width);

		let stack = d3.stack()
		 	.keys(keys)
		 	.offset(d3.stackOffsetNone);

		svg.append("g")
			.selectAll("g")
			.data(state)
			.enter().append("g")
				.attr("height", (height-margin))
				.attr("width", xScale.bandwidth())
				.attr("transform", (d,i) => { return "translate("+xScale(Object.keys(d)[0])+",0)"; })
				.attr("class", props.barClassNames)
				.on("click", function(d){
					d3.selectAll("g").classed(props.barSelectedClassNames, false ); 
					d3.select(this).classed(props.barSelectedClassNames, true );
					props.barSelectedCallback(d)})
				.selectAll("g")
				.data((d) => { return stack(d[Object.keys(d)[0]]); })
				.enter().append("g")
					.attr("class", (d) =>{ return self.getKeyClassName(props.classNamesMap, d.key); })
					.append("rect")
					.attr("y", (d) => { return yScale(d[0][1]); })
					.attr("height", function(d) { return yScale(d[0][0]) - yScale(d[0][1]); })
					.attr("width", xScale.bandwidth());
 
		let xAxis = d3.axisBottom(xScale).tickSize(0);

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height-margin) + ")")
		    .call(xAxis);

		svg.selectAll("text")
			.attr("y", 9);



		// Redraw based on the new size whenever the browser window is resized.
      	//window.addEventListener("resize", utils.throttle(self.update.bind(self), 200));
	},

	update(el, props, state){


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
	}
	

}

export default stackedBarChart;