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
	}

}

export default utils;