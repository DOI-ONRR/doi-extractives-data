import React, { Component, PropTypes } from 'react';
import {
	add,
	compose,
	contains,
	defaultTo,
	find,
	flip,
	has,
	head,
	last,
	map,
	max,
	mergeWith,
	partition,
	propOr,
	reduce,
	values
} from 'ramda';

import localize from './localize';
import { slugify } from './utils';

import FilledBar from './filled-bar';

const revenueTypes = [
	'Bonus',
	'Rents',
	'Royalties',
	'Other Revenues'
];

const isOilOrGas = flip( contains )( [
	'Gas',
	'Oil',
	'Oil & Gas (Non-Royalty)'
] );

export class OilGasTable extends Component {
	render() {
		const {
			asCurrency,
			title,
			icons,
			data: rawData,
			maxRevenue
		} = this.props;

		const [ oilGasGroup, other ] = compose(
			partition( compose( isOilOrGas, head ) )
		)( rawData );

		const oilGas = reduce( mergeWith( add ), {}, map( last, oilGasGroup ) );
		const oil = last( defaultTo( [0, {}], find( d => d[0] === 'Oil', rawData ) ) );
		const gas = last( defaultTo( [0, {}], find( d => d[0] === 'Gas', rawData ) ) );

		const getRevenue = ( category, data ) => propOr( 0, category, data );

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
				{ revenueTypes
					.map( type => (
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
					) )
				}
			</tr>
			{ other.map( ( [ type, typeData ] ) => (
				<tr key={ `revenue-type-${ slugify( type ) }` }>
					<th scope="row">
						<a href={ `#revenue-${ slugify( title ) }` }>
							<strong>{ type }</strong>
						</a><br />
						<strong>{ asCurrency( getRevenue( 'All', typeData ) ) }</strong>
					</th>
					{ revenueTypes
						.map( type => (
							<td key={ `revenue-type-type-${ slugify( type ) }` } >
									<span className="text">
										<FilledBar
											height={ 15 }
											width={ 122 }
											values={ [ getRevenue( type, typeData ) ] }
											maxValue={ maxRevenue }
										/><br />
										{ asCurrency( getRevenue( type, typeData ) ) }
									</span>
							</td>
						) )
					}
				</tr>
			) ) }
			</tbody>
		);
	}
}

export default localize( OilGasTable );
