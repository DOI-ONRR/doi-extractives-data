import React from 'react';
import ReactDOM from 'react-dom';
import {
	any,
	compose,
	defaultTo,
	filter,
	flip,
	fromPairs,
	has,
	head,
	last,
	lt,
	map,
	max,
	pathOr,
	pick,
	propOr,
	reduce,
	toPairs,
	values
} from 'ramda';

import CommodityTable from '../react/commodity-revenue-table';
import OilGasTable from '../react/oil-gas-table';
import {
	allRevenueTotals
} from '../react/revenue-table-helpers';

const revenueYear = window.revenueYear;
const revenueData = window.revenueData;
const commodityData = window.commodityData;
const commodityNames = window.commodityNames;

const commodityTypes = [
	'oilgas',
	'coal',
	'renewables',
	'minerals'
];

const categoryData = {
	oilgas: {
		icons: [ 'oil' ],
		label: 'Oil and Gas'
	},
	coal: {
		icons: [ 'coal' ],
		label: 'Coal'
	},
	minerals: {
		icons: [ 'minerals' ],
		label: 'Hardrock Minerals'
	},
	renewables: {
		icons: [ 'geo' ],
		label: 'Geothermal'
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
	const types = compose (
		filter( flip( has )( revenueData ) ),
		propOr( [], 'commodities' )
	);

	const typesData = compose(
		toPairs,
		filter( compose( any( lt( 0 ) ), values ) ),
		fromPairs,
		map( type => [ mapCommodityNames( type ), getCommodityValues( type ) ] )
	);

	const commoditiesData = map( compose( typesData, types ), commodityData );

	const totals = allRevenueTotals( commoditiesData );
	const maxRevenue = reduce( max, 0, values( totals ) );

	const myTypes = map( compose(
		a => !! a.length,
		types
	), commodityData );

	const availableTypes = commodityTypes
		.filter( type => propOr( false, type, myTypes ) )
		.filter( type => commoditiesData[ type ].length );

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
			{ availableTypes.map( type => React.createElement(
				'oilgas' === type ? OilGasTable : CommodityTable,
				{
					key: type,
					title: pathOr( commodityData[ type ].name, [ type, 'label' ], categoryData ),
					icons: pathOr( [], [ type, 'icons' ], categoryData ),
					data: commoditiesData[ type ],
					maxRevenue: maxRevenue
				}
			) ) }
			{ availableTypes.length > 1 &&
				<CommodityTable
					key="All"
					title="All Commodities"
					icons={ availableTypes.map( type => pathOr( [], [ type, 'icons' ], categoryData ) )  }
					data={ [ [ 'All commodities', totals ] ] }
					maxRevenue={ maxRevenue }
				/>
			}
		</table>,
		document.getElementById( 'state-revenue-table-react' )
	);
};

revenueData && stateRevenueTable();
