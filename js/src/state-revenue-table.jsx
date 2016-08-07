import React from 'react';
import ReactDOM from 'react-dom';
import {
	any,
	clone,
	compose,
	defaultTo,
	filter,
	flip,
	fromPairs,
	has,
	head,
	lt,
	map,
	pathOr,
	pick,
	propOr,
	toPairs,
	values
} from 'ramda';

import CommodityTable from '../react/commodity-revenue-table';

const revenueYear = clone( window.revenueYear );
const revenueData = clone( window.revenueData );
const commodityData = clone( window.commodityData );
const commodityNames = clone( window.commodityNames );

console.log( revenueData );
console.log( commodityData );

const commodityTypes = [
	'oilgas',
	'coal',
	'renewables',
	'minerals',
	'other'
];

const categoryData = {
	oilgas: {
		icons: [ 'oil' ]
	}
};

const mapCommodityNames = name => propOr( name, name, commodityNames );

const getCommodityValues = type => map( compose(
	defaultTo( 0 ),
	head,
	values,
	pick( [ revenueYear ] )
), propOr( {}, type, revenueData ) );

const stateRevenueTable = () => {
	const oilgas = propOr( {}, 'oilgas', commodityData );
	const types = compose (
		filter( flip( has )( revenueData ) ),
		propOr( [], 'commodities' )
	)( oilgas );

	const typesData = compose(
		map( ( [ name, data ] ) => [ mapCommodityNames( name ), data ] ),
		toPairs,
		filter( compose( any( lt( 0 ) ), values ) ),
		fromPairs,
		map( type => [ type, getCommodityValues( type ) ] )
	)( types );

	ReactDOM.render(
		<table className="revenue table-arrow_box">
			<thead>
			<tr>
				<th className="arrow_box"><span>Commodity</span></th>
				<th className="arrow_box"><span>1. Securing rights</span></th>
				<th className="arrow_box"><span>2. Before production</span></th>
				<th className="arrow_box-last"><span>3. During production</span></th>
				<th><span>Other revenue</span></th>
			</tr>
			</thead>
			<CommodityTable
				key={ oilgas.name }
				title={ oilgas.name }
				icons={ categoryData.oilgas.icons }
				data={ typesData }
			/>
		</table>,
		document.getElementById( 'state-revenue-table-react' )
	);
};

stateRevenueTable();
