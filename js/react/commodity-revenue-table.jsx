import React, { Component } from 'react';
import {
	has,
	propOr
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

		const getRevenue = category => propOr( 0, category, data );

		const iconClasses = icons
			.concat( 'padded' )
			.map( icon => `icon-${ icon }` )
			.join( ' ' );

		return (
			<tbody id={ `revenue-${ slugify( title ) }` }>
				<tr className="table-arrow_box-category">
					<td colSpan="5">
						{ title + ' ' }
						<icon className={ iconClasses } />
					</td>
				</tr>
				<tr>
					<th scope="row">
						<a href={ `#revenue-${ slugify( title ) }` }>
							<strong>{ type }</strong>
						</a><br />
						<strong>{ asCurrency( getRevenue( 'All' ) ) }</strong>
					</th>
					{ revenueTypes
						.map( type => (
							<td key={ `revenue-type-${ slugify( type ) }` } >
								<span className="text">
									<FilledBar
										height={ 15 }
										width={ 122 }
										value={ getRevenue( type ) }
										maxValue={ getRevenue( 'All' ) }
									/><br />
									{ asCurrency( getRevenue( type ) ) }
								</span>
							</td>
						) )
					}
				</tr>
			</tbody>
		);
	}
}

export default localize( CommodityRevenueTable );
