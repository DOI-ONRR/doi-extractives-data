import slugify from 'slugify';
import currencyFormatter from 'currency-formatter';

// Import Display Name Yaml Files
import commodityNames from '../data/commodity_names.yml';

const utils = {
	getDisplayName_CommodityName: (key) => {
		return commodityNames[key] || key;
	},

	formatToSlug: (name) => {
		return slugify(name, {lower:true, remove: /[$*_+~.()'"!\:@,]/g}).replace('-and-','-');
	},

	formatToDollarInt: (value) => {
		return currencyFormatter.format(value, { symbol:'$', precision: 0, format: {pos: '%s%v',neg: '(%s%v)', zero: '%s%v'}});
	},

	formatToCommaInt: (value) => {
		return currencyFormatter.format(value, { symbol:'', precision: 0, format: {pos: '%s%v',neg: '(%s%v)', zero: '%s%v'}});
	},
	throttle: (callback, limit) => {
	    var wait = true;                  	// Initially, we're not waiting
	    return function () {               	// We return a throttled function
	        if (wait) {                   	// If we're not waiting  					
	            wait = false;               // Prevent future invocations
	            setTimeout(function () {   	// After a period of time
	                callback.call();        // Execute users function
	                wait = true;			// And allow future invocations
	            }, limit);
	        }
	    }
	},
	groupBy(data, group) {
		let groups = {};

		data.map((item, index) => {

			let itemGroup = this.resolveByStringPath(group, item);
			let list = groups[itemGroup];

			if(list) {
				list.push(item);
			}
			else {
				groups[itemGroup] = [item];
			}
		});

		return groups;
	},
	sumBy(data, group) {
		let groups = {};

		data.map((item, index) => {

			let itemGroup = this.resolveByStringPath(group, item);
			let list = groups[itemGroup];

			if(list) {
				list.push(item);
			}
			else {
				groups[itemGroup] = [item];
			}
		});

		return groups;
	},
	resolveByStringPath(path, obj) {
	    return path.split('.').reduce(function(prev, curr) {
	        return prev ? prev[curr] : undefined
	    }, obj || self)
	},
	range(start, end) {
		return Array(end - start + 1).fill().map((_, idx) => start + idx)
	},
	round(number, precision)
	{
	    precision = precision || 0;
	    return parseFloat( number ).toFixed( precision );
	}
}

export default utils;


