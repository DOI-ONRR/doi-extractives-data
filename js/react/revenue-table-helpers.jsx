import {
	add,
	compose,
	defaultTo,
	equals,
	find,
	head,
	last,
	map,
	mergeWith,
	propOr,
	reduce,
	values
} from 'ramda';

export const getRevenue = propOr( 0 );

export const pullOut = name => compose(
	last,
	defaultTo( [ 0, {} ] ),
	find( compose( equals( name ), head ) )
);

export const revenueTotals = compose(
	reduce( mergeWith( add ), {} ),
	map( last )
);

export const allRevenueTotals = compose(
	reduce( mergeWith( add ), {} ),
	values,
	map( revenueTotals )
);

export const revenueTypes = [
	'Bonus',
	'Rents',
	'Royalties',
	'Other Revenues'
];
