import slugify from 'slugify';
import currencyFormatter from 'currency-formatter';

// Import Display Name Yaml Files
import commodityNames from '../data/commodity_names.yml';

const utils = {
	includes: (search, value) => {
		return(search.indexOf(value) > 0);
	},
	getDisplayName: (key) => {
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
	resolveByStringPath(path, obj) {
	    return path.split('.').reduce(function(prev, curr) {
	        return prev ? prev[curr] : undefined
	    }, obj || self)
	},
	range(start, end) {
		if (!Array.prototype.fill) {
		  Object.defineProperty(Array.prototype, 'fill', {
		    value: function(value) {

		      // Steps 1-2.
		      if (this == null) {
		        throw new TypeError('this is null or not defined');
		      }

		      var O = Object(this);

		      // Steps 3-5.
		      var len = O.length >>> 0;

		      // Steps 6-7.
		      var start = arguments[1];
		      var relativeStart = start >> 0;

		      // Step 8.
		      var k = relativeStart < 0 ?
		        Math.max(len + relativeStart, 0) :
		        Math.min(relativeStart, len);

		      // Steps 9-10.
		      var end = arguments[2];
		      var relativeEnd = end === undefined ?
		        len : end >> 0;

		      // Step 11.
		      var final = relativeEnd < 0 ?
		        Math.max(len + relativeEnd, 0) :
		        Math.min(relativeEnd, len);

		      // Step 12.
		      while (k < final) {
		        O[k] = value;
		        k++;
		      }

		      // Step 13.
		      return O;
		    }
		  });
		}
		return Array(end - start + 1).fill().map((_, idx) => start + idx)
	}
}

export default utils;


