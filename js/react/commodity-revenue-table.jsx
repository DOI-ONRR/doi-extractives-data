import React, { Component } from 'react';
import {
	has,
	last,
	map,
	max,
	propOr,
	reduce
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


export class CommodityRevenueTable extends Component {
	render() {
		const {
			asCurrency,
			title,
			type,
			icons,
			data
		} = this.props;
		console.log( this.props );

		const getRevenue = ( category, data ) => propOr( 0, category, data );

		const iconClasses = icons
			.concat( 'padded' )
			.map( icon => `icon-${ icon }` )
			.join( ' ' );

		const maxRevenue = reduce( max, 0, map( propOr( 0, 'All' ), map( last, data ) ) );

		return (
			<tbody id={ `revenue-${ slugify( title ) }` }>
				<tr className="table-arrow_box-category">
					<td colSpan="5">
						{ title + ' ' }
						<icon className={ iconClasses } />
					</td>
				</tr>
				{ data.map( ( [ type, typeData ] ) => (
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
											value={ getRevenue( type, typeData ) }
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

export default localize( CommodityRevenueTable );
