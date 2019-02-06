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
	                wait = true;						// And allow future invocations
	            }, limit);
	        }
	    }
	},
	groupBy(data, group) {
		let groups = {};

		data.map((item, index) => {
			let itemGroup = '';

			if(Array.isArray(group)) {
				group.forEach((entry, index) => {
					itemGroup += this.resolveByStringPath(entry, item)+"_";
					
				});
				itemGroup = itemGroup.slice(0, -1); 
			}
			else{
				itemGroup = this.resolveByStringPath(group, item);
			}
			
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
	},
  hashLinkScroll() {
  	const scrollToElement = () => {
	    const { hash } = window.location;
	    if (hash !== '') {
	      // Push onto callback queue so it runs after the DOM is updated,
	      // this is required when navigating from a different page so that
	      // the element is rendered on the page before trying to getElementById.
	      setTimeout(() => {
	        const id = hash.replace('#', '');
	        const element = document.getElementById(id);
	        if (element) element.scrollIntoView();
	      }, 0);
	    }
  	}


  	window.addEventListener('load', scrollToElement);
  }
}

export default utils;


