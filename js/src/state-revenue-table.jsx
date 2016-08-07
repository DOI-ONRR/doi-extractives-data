import React from 'react';
import ReactDOM from 'react-dom';
import {
	clone,
	flatten,
	flip,
	has,
	propOr
} from 'ramda';

import CommodityTable from '../react/commodity-revenue-table';

const revenueYear = clone( window.revenueYear );
const revenueData = clone( window.revenueData );
const commodityData = clone( window.commodityData );

console.log( revenueYear );
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

const stateRevenueTable = () => {
	const oilgas = propOr( {}, 'oilgas', commodityData );
	const types =
		propOr( [], 'commodities', oilgas )
			.filter( flip( has )( revenueData ) );

	console.log( oilgas );
	console.log( types );

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
			{ flatten( types.map( type => (
				<CommodityTable
					key={ type }
					title={ oilgas.name }
					icons={ categoryData.oilgas.icons }
					type={ type }
					data={ propOr( {}, type, revenueData ) }
					year={ revenueYear }
				/>
			) ) ) }
		</table>,
		document.getElementById( 'state-revenue-table-react' )
	);
};

stateRevenueTable();
