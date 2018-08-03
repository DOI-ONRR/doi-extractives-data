import slugify from 'slugify';
import currencyFormatter from 'currency-formatter';

const utils = {
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
	}
}

export default utils;