import React, { Component, PropTypes } from 'react';
import {
	compose,
	contains,
	flip,
	head,
	map,
	max,
	partition,
	values
} from 'ramda';

import localize from './localize';
import { slugify } from './utils';
import {
	getRevenue,
	pullOut,
	revenueTotals,
	revenueTypes
} from './revenue-table-helpers';

import CommodityRow from './commodity-revenue-row';
import FilledBar from './filled-bar';

const isOilOrGas = flip( contains )( [
	'Gas',
	'Oil',
	'Oil & Gas (Non-Royalty)'
] );

export const OilGasTable = props => {
	const {
		asCurrency,
		title,
		icons,
		data: rawData,
		maxRevenue
	} = props;

	const [ oilGasGroup, other ] = partition(
		compose( isOilOrGas, head ),
		rawData
	);

	const oilGas = revenueTotals( oilGasGroup );
	const oil = pullOut( 'Oil' )( rawData );
	const gas = pullOut( 'Gas' )( rawData );

	return (
		<tbody id={ `revenue-${ slugify( title ) }` }>
		<tr className="table-arrow_box-category">
			<td colSpan="5">
				{ title }
				{ icons.map( ( className, index ) => (
					<icon
						key={ index }
						className={ `icon-${ className }` }
						style={ { marginLeft: '4px' } }
					/>
				) ) }
			</td>
		</tr>
		<tr key="revenue-type-oil-and-gas">
			<th scope="row">
				<a href="#revenue-oil-and-gas">
					<strong>Oil & Gas</strong>
				</a><br />
				<strong>{ asCurrency( getRevenue( 'All', oilGas ) ) }</strong>
			</th>
			{ revenueTypes.map( type => (
				<td key={ `revenue-type-${ slugify( type ) }` }>
					<span className="text">
						<FilledBar
							height={ 15 }
							width={ 122 }
							values={ ( getRevenue( type, oil ) > 0 || getRevenue( type, gas ) > 0 )
								? [
									getRevenue( type, oil ),
									getRevenue( type, gas )
								  ]
								: [ getRevenue( type, oilGas ) ]
							}
							maxValue={ maxRevenue }
						/><br />
						{ getRevenue( type, oil ) > 0 &&
							<div><strong>Oil</strong> { asCurrency( getRevenue( type, oil ) ) }</div>
						}
						{ getRevenue( type, gas ) > 0 &&
							<div><strong>Gas</strong> { asCurrency( getRevenue( type, gas ) ) }</div>
						}
						{ ( getRevenue( type, oil ) <= 0 && getRevenue( type, gas ) <= 0) &&
							asCurrency(
								getRevenue( type, oilGas ) -
								getRevenue( type, oil ) -
								getRevenue( type, gas )
							)
						}
					</span>
				</td>
			) ) }
		</tr>
		{ other.map( ( [ type, typeData ] ) => (
			<CommodityRow { ...{
				title,
				type,
				maxRevenue,
				key: type,
				data: typeData
			} } />
		) ) }
		</tbody>
	);
};

export default localize( OilGasTable );
